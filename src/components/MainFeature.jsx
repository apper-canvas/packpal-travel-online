import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, differenceInDays } from 'date-fns'
import ApperIcon from './ApperIcon'
import { tripService, packingListService, packingItemService } from '../services'

function MainFeature({ onTripCreated, onCancel }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Trip form data
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'leisure',
    weatherCondition: 'mild'
  })

  // Generated packing list
  const [packingList, setPackingList] = useState(null)
  const [packingItems, setPackingItems] = useState([])
  const [newItemName, setNewItemName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Clothing')

  const tripTypes = [
    { value: 'leisure', label: 'Leisure', icon: 'Palmtree' },
    { value: 'business', label: 'Business', icon: 'Briefcase' },
    { value: 'adventure', label: 'Adventure', icon: 'Mountain' },
    { value: 'beach', label: 'Beach', icon: 'Waves' }
  ]

  const weatherConditions = [
    { value: 'cold', label: 'Cold', icon: 'Snowflake', temp: '< 10°C' },
    { value: 'mild', label: 'Mild', icon: 'Cloud', temp: '10-20°C' },
    { value: 'warm', label: 'Warm', icon: 'Sun', temp: '20-30°C' },
    { value: 'hot', label: 'Hot', icon: 'Thermometer', temp: '> 30°C' }
  ]

  const categories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Accessories', 'Other']

  useEffect(() => {
    if (step === 2 && packingList) {
      loadPackingItems()
    }
  }, [step, packingList])

  const loadPackingItems = async () => {
    setLoading(true)
    try {
      const items = await packingItemService.getAll()
      const filteredItems = items.filter(item => item.packingListId === packingList.id)
      setPackingItems(filteredItems || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generatePackingList = async () => {
    setLoading(true)
    try {
      // Calculate trip duration
      const duration = differenceInDays(new Date(tripData.endDate), new Date(tripData.startDate)) + 1

      // Create trip
      const trip = await tripService.create({
        ...tripData,
        duration,
        weather: {
          condition: tripData.weatherCondition,
          temperature: getTemperatureRange(tripData.weatherCondition)
        }
      })

      // Create packing list
      const list = await packingListService.create({
        tripId: trip.id,
        categories: categories,
        completionPercentage: 0
      })

      // Generate items based on trip parameters
      const generatedItems = generateItems(tripData, duration)
      
      // Create packing items
      const itemPromises = generatedItems.map(item => 
        packingItemService.create({
          ...item,
          packingListId: list.id
        })
      )
      
      await Promise.all(itemPromises)

      setPackingList(list)
      onTripCreated(trip)
      setStep(2)
      
    } catch (err) {
      setError(err.message)
      toast.error("Failed to generate packing list")
    } finally {
      setLoading(false)
    }
  }

  const generateItems = (tripData, duration) => {
    const baseItems = [
      // Clothing
      { name: 'Underwear', category: 'Clothing', quantity: duration + 1 },
      { name: 'Socks', category: 'Clothing', quantity: duration + 1 },
      { name: 'T-shirts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
      { name: 'Pants/Shorts', category: 'Clothing', quantity: Math.ceil(duration / 3) },
      { name: 'Sleepwear', category: 'Clothing', quantity: 2 },
      
      // Toiletries
      { name: 'Toothbrush', category: 'Toiletries', quantity: 1 },
      { name: 'Toothpaste', category: 'Toiletries', quantity: 1 },
      { name: 'Shampoo', category: 'Toiletries', quantity: 1 },
      { name: 'Deodorant', category: 'Toiletries', quantity: 1 },
      
      // Electronics
      { name: 'Phone Charger', category: 'Electronics', quantity: 1 },
      { name: 'Power Bank', category: 'Electronics', quantity: 1 },
      
      // Documents
      { name: 'Passport/ID', category: 'Documents', quantity: 1 },
      { name: 'Travel Insurance', category: 'Documents', quantity: 1 },
      { name: 'Tickets', category: 'Documents', quantity: 1 }
    ]

    // Add trip-specific items
    if (tripData.tripType === 'business') {
      baseItems.push(
        { name: 'Formal Shirts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Business Suit', category: 'Clothing', quantity: 1 },
        { name: 'Laptop', category: 'Electronics', quantity: 1 },
        { name: 'Business Cards', category: 'Documents', quantity: 1 }
      )
    }

    if (tripData.tripType === 'beach') {
      baseItems.push(
        { name: 'Swimwear', category: 'Clothing', quantity: 2 },
        { name: 'Flip-flops', category: 'Clothing', quantity: 1 },
        { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
        { name: 'Beach Towel', category: 'Accessories', quantity: 1 }
      )
    }

    if (tripData.tripType === 'adventure') {
      baseItems.push(
        { name: 'Hiking Boots', category: 'Clothing', quantity: 1 },
        { name: 'Rain Jacket', category: 'Clothing', quantity: 1 },
        { name: 'First Aid Kit', category: 'Other', quantity: 1 },
        { name: 'Water Bottle', category: 'Accessories', quantity: 1 }
      )
    }

    // Add weather-specific items
    if (tripData.weatherCondition === 'cold') {
      baseItems.push(
        { name: 'Winter Coat', category: 'Clothing', quantity: 1 },
        { name: 'Warm Sweaters', category: 'Clothing', quantity: 2 },
        { name: 'Gloves', category: 'Accessories', quantity: 1 },
        { name: 'Scarf', category: 'Accessories', quantity: 1 }
      )
    }

    if (tripData.weatherCondition === 'hot') {
      baseItems.push(
        { name: 'Light Shirts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Shorts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Sun Hat', category: 'Accessories', quantity: 1 },
        { name: 'Sunglasses', category: 'Accessories', quantity: 1 }
      )
    }

    return baseItems.map(item => ({
      ...item,
      isPacked: false,
      isCustom: false
    }))
  }

  const getTemperatureRange = (condition) => {
    const ranges = {
      cold: '< 10°C',
      mild: '10-20°C', 
      warm: '20-30°C',
      hot: '> 30°C'
    }
    return ranges[condition]
  }

  const handleInputChange = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddCustomItem = async () => {
    if (!newItemName.trim()) return

    try {
      const newItem = await packingItemService.create({
        name: newItemName.trim(),
        category: selectedCategory,
        quantity: 1,
        isPacked: false,
        isCustom: true,
        packingListId: packingList.id
      })

      setPackingItems(prev => [...prev, newItem])
      setNewItemName('')
      toast.success("Item added successfully!")
    } catch (err) {
      toast.error("Failed to add item")
    }
  }

  const handleToggleItem = async (itemId) => {
    try {
      const item = packingItems.find(i => i.id === itemId)
      const updatedItem = await packingItemService.update(itemId, {
        isPacked: !item.isPacked
      })

      setPackingItems(prev => 
        prev.map(i => i.id === itemId ? updatedItem : i)
      )

      // Update completion percentage
      const newItems = packingItems.map(i => i.id === itemId ? updatedItem : i)
      const packedCount = newItems.filter(i => i.isPacked).length
      const completionPercentage = Math.round((packedCount / newItems.length) * 100)

      await packingListService.update(packingList.id, { completionPercentage })

      if (completionPercentage === 100) {
        toast.success("🎉 Packing complete! You're ready to go!")
      }
    } catch (err) {
      toast.error("Failed to update item")
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await packingItemService.delete(itemId)
      setPackingItems(prev => prev.filter(i => i.id !== itemId))
      toast.success("Item removed!")
    } catch (err) {
      toast.error("Failed to remove item")
    }
  }

  const isFormValid = () => {
    return tripData.destination && tripData.startDate && tripData.endDate && 
           new Date(tripData.endDate) >= new Date(tripData.startDate)
  }

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = packingItems.filter(item => item.category === category)
    return acc
  }, {})

  const totalItems = packingItems.length
  const packedItems = packingItems.filter(item => item.isPacked).length
  const completionPercentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-soft overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold">
                {step === 1 ? "Plan Your Trip" : "Your Packing List"}
              </h2>
              <p className="text-white/80">
                {step === 1 
                  ? "Tell us about your destination and we'll create a perfect packing list"
                  : "Check off items as you pack them"
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </motion.button>
          </div>

          {step === 2 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Packing Progress</span>
                <span>{packedItems}/{totalItems} items</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-white h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={tripData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Trip Type */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Trip Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tripTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange('tripType', type.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          tripData.tripType === type.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <ApperIcon name={type.icon} className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{type.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Weather */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Expected Weather
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {weatherConditions.map((weather) => (
                      <motion.button
                        key={weather.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange('weatherCondition', weather.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          tripData.weatherCondition === weather.value
                            ? 'border-secondary bg-secondary/5 text-secondary'
                            : 'border-surface-200 hover:border-surface-300'
                        }`}
                      >
                        <ApperIcon name={weather.icon} className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{weather.label}</div>
                        <div className="text-xs text-surface-500">{weather.temp}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generatePackingList}
                  disabled={!isFormValid() || loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-card hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating List...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Sparkles" className="h-5 w-5" />
                      <span>Generate Packing List</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Add Custom Item */}
                <div className="bg-surface-50 rounded-xl p-4">
                  <h3 className="font-semibold text-surface-900 mb-3">Add Custom Item</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Item name"
                      className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddCustomItem}
                      disabled={!newItemName.trim()}
                      className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ApperIcon name="Plus" className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Packing List by Category */}
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryItems = groupedItems[category] || []
                    if (categoryItems.length === 0) return null

                    const categoryPacked = categoryItems.filter(item => item.isPacked).length

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-surface-900 flex items-center space-x-2">
                            <span>{category}</span>
                            <span className="text-sm text-surface-500 bg-surface-100 px-2 py-1 rounded-full">
                              {categoryPacked}/{categoryItems.length}
                            </span>
                          </h3>
                        </div>

                        <div className="space-y-2">
                          {categoryItems.map(item => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                item.isPacked 
                                  ? 'bg-success/5 border-success/20' 
                                  : 'bg-white border-surface-200 hover:border-surface-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleToggleItem(item.id)}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    item.isPacked
                                      ? 'bg-success border-success text-white'
                                      : 'border-surface-300 hover:border-primary'
                                  }`}
                                >
                                  {item.isPacked && <ApperIcon name="Check" className="h-4 w-4" />}
                                </motion.button>
                                
                                <div className="flex-1">
                                  <span className={`${item.isPacked ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                                    {item.name}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="ml-2 text-sm text-surface-500">
                                      × {item.quantity}
                                    </span>
                                  )}
                                  {item.isCustom && (
                                    <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                                      Custom
                                    </span>
                                  )}
                                </div>
                              </div>

                              {item.isCustom && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-surface-400 hover:text-red-500 transition-colors"
                                >
                                  <ApperIcon name="Trash2" className="h-4 w-4" />
                                </motion.button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Completion Status */}
                {completionPercentage === 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-success to-primary p-6 rounded-xl text-white text-center"
                  >
                    <ApperIcon name="CheckCircle" className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">🎉 All Packed!</h3>
                    <p>You're ready for your adventure. Have a great trip!</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature