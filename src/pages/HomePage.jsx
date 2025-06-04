import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { tripService } from '../services'

function Home() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showNewTrip, setShowNewTrip] = useState(false)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load trips")
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const handleTripCreated = (newTrip) => {
    setTrips(prev => [newTrip, ...prev])
    setShowNewTrip(false)
    toast.success("Trip created successfully!")
  }

  const handleDeleteTrip = async (tripId) => {
    try {
      await tripService.delete(tripId)
      setTrips(prev => prev.filter(trip => trip.id !== tripId))
      toast.success("Trip deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete trip")
    }
  }

  if (loading && trips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-surface-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Luggage" className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-surface-900">PackPal</h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewTrip(true)}
              className="bg-primary text-white px-4 py-2 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
              <span className="hidden sm:inline">New Trip</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-surface-900 leading-tight">
              Pack Smart,
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Travel Better
              </span>
            </h2>
            <p className="text-xl text-surface-600 max-w-2xl mx-auto">
              Generate personalized packing lists based on your destination, weather, and trip type. 
              Never forget the essentials again.
            </p>
          </motion.div>
        </div>

        {/* Feature Section */}
        <AnimatePresence mode="wait">
          {showNewTrip ? (
            <motion.div
              key="new-trip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <MainFeature onTripCreated={handleTripCreated} onCancel={() => setShowNewTrip(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="trips-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Trips Grid */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {trips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                    <ApperIcon name="MapPin" className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold text-surface-900 mb-2">
                    Ready for your first adventure?
                  </h3>
                  <p className="text-surface-600 mb-6 max-w-md mx-auto">
                    Create your first trip to get personalized packing lists and never forget essentials again.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewTrip(true)}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-200"
                  >
                    Create Your First Trip
                  </motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.map((trip) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      <div className="h-48 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-heading font-semibold">{trip.destination}</h3>
                          <p className="text-white/80 text-sm">
                            {trip.startDate} - {trip.endDate}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4 text-white" />
                        </motion.button>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {trip.tripType}
                          </span>
                          <div className="flex items-center space-x-1 text-surface-600">
                            <ApperIcon name="Calendar" className="h-4 w-4" />
                            <span className="text-sm">{trip.duration} days</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Thermometer" className="h-4 w-4 text-surface-500" />
                            <span className="text-sm text-surface-600">
                              {trip.weather?.temperature || "N/A"}°
                            </span>
                          </div>
                          <button className="text-primary font-medium text-sm hover:text-primary-dark transition-colors">
                            View List →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto">
              <ApperIcon name="Brain" className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-semibold">Smart Suggestions</h3>
            <p className="text-surface-600">
              AI-powered recommendations based on destination, weather, and trip type.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto">
              <ApperIcon name="CheckSquare" className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-heading font-semibold">Track Progress</h3>
            <p className="text-surface-600">
              Check off items as you pack and see your progress in real-time.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/20 rounded-2xl flex items-center justify-center mx-auto">
              <ApperIcon name="Clock" className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-heading font-semibold">Last-Minute Reminders</h3>
            <p className="text-surface-600">
              Get essential reminders before departure so you never forget the basics.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Home