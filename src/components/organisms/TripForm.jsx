import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { differenceInDays } from 'date-fns';
import FormField from '../molecules/FormField';
import TripOptionCard from '../molecules/TripOptionCard';
import Button from '../atoms/Button';
import InfoCard from '../molecules/InfoCard';
import { tripService, packingListService, packingItemService } from '../../services';

function TripForm({ onTripCreated, onGenerationComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'leisure',
    weatherCondition: 'mild'
  });

  const tripTypes = [
    { value: 'leisure', label: 'Leisure', icon: 'Palmtree' },
    { value: 'business', label: 'Business', icon: 'Briefcase' },
    { value: 'adventure', label: 'Adventure', icon: 'Mountain' },
    { value: 'beach', label: 'Beach', icon: 'Waves' }
  ];

  const weatherConditions = [
    { value: 'cold', label: 'Cold', icon: 'Snowflake', temp: '< 10°C' },
    { value: 'mild', label: 'Mild', icon: 'Cloud', temp: '10-20°C' },
    { value: 'warm', label: 'Warm', icon: 'Sun', temp: '20-30°C' },
    { value: 'hot', label: 'Hot', icon: 'Thermometer', temp: '> 30°C' }
  ];

  const categories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Accessories', 'Other'];

  const handleInputChange = (field, value) => {
    setTripData(prev => ({ ...prev, [field]: value }));
  };

  const getTemperatureRange = (condition) => {
    const ranges = {
      cold: '< 10°C',
      mild: '10-20°C', 
      warm: '20-30°C',
      hot: '> 30°C'
    };
    return ranges[condition];
  };

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
    ];

    // Add trip-specific items
    if (tripData.tripType === 'business') {
      baseItems.push(
        { name: 'Formal Shirts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Business Suit', category: 'Clothing', quantity: 1 },
        { name: 'Laptop', category: 'Electronics', quantity: 1 },
        { name: 'Business Cards', category: 'Documents', quantity: 1 }
      );
    }

    if (tripData.tripType === 'beach') {
      baseItems.push(
        { name: 'Swimwear', category: 'Clothing', quantity: 2 },
        { name: 'Flip-flops', category: 'Clothing', quantity: 1 },
        { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
        { name: 'Beach Towel', category: 'Accessories', quantity: 1 }
      );
    }

    if (tripData.tripType === 'adventure') {
      baseItems.push(
        { name: 'Hiking Boots', category: 'Clothing', quantity: 1 },
        { name: 'Rain Jacket', category: 'Clothing', quantity: 1 },
        { name: 'First Aid Kit', category: 'Other', quantity: 1 },
        { name: 'Water Bottle', category: 'Accessories', quantity: 1 }
      );
    }

    // Add weather-specific items
    if (tripData.weatherCondition === 'cold') {
      baseItems.push(
        { name: 'Winter Coat', category: 'Clothing', quantity: 1 },
        { name: 'Warm Sweaters', category: 'Clothing', quantity: 2 },
        { name: 'Gloves', category: 'Accessories', quantity: 1 },
        { name: 'Scarf', category: 'Accessories', quantity: 1 }
      );
    }

    if (tripData.weatherCondition === 'hot') {
      baseItems.push(
        { name: 'Light Shirts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Shorts', category: 'Clothing', quantity: Math.ceil(duration / 2) },
        { name: 'Sun Hat', category: 'Accessories', quantity: 1 },
        { name: 'Sunglasses', category: 'Accessories', quantity: 1 }
      );
    }

    return baseItems.map(item => ({
      ...item,
      isPacked: false,
      isCustom: false
    }));
  };

  const handleGenerateList = async () => {
    setLoading(true);
    setError(null);
    try {
      const duration = differenceInDays(new Date(tripData.endDate), new Date(tripData.startDate)) + 1;

      const trip = await tripService.create({
        ...tripData,
        duration,
        weather: {
          condition: tripData.weatherCondition,
          temperature: getTemperatureRange(tripData.weatherCondition)
        }
      });

      const list = await packingListService.create({
        tripId: trip.id,
        categories: categories,
        completionPercentage: 0
      });

      const generatedItems = generateItems(tripData, duration);
      const itemPromises = generatedItems.map(item => 
        packingItemService.create({
          ...item,
          packingListId: list.id
        })
      );
      await Promise.all(itemPromises);

      onTripCreated(trip);
      onGenerationComplete(list);
      toast.success("Packing list generated successfully!");
      
    } catch (err) {
      setError(err.message || "An unexpected error occurred during list generation.");
      toast.error("Failed to generate packing list");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return tripData.destination && tripData.startDate && tripData.endDate && 
           new Date(tripData.endDate) >= new Date(tripData.startDate);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <FormField
        label="Destination"
        type="text"
        value={tripData.destination}
        onChange={(e) => handleInputChange('destination', e.target.value)}
        placeholder="Where are you going?"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          type="date"
          value={tripData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          required
        />
        <FormField
          label="End Date"
          type="date"
          value={tripData.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">Trip Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tripTypes.map((type) => (
            <TripOptionCard
              key={type.value}
              icon={type.icon}
              label={type.label}
              value={type.value}
              isSelected={tripData.tripType === type.value}
              onClick={() => handleInputChange('tripType', type.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">Expected Weather</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {weatherConditions.map((weather) => (
            <TripOptionCard
              key={weather.value}
              icon={weather.icon}
              label={weather.label}
              detail={weather.temp}
              value={weather.value}
              isSelected={tripData.weatherCondition === weather.value}
              onClick={() => handleInputChange('weatherCondition', weather.value)}
            />
          ))}
        </div>
      </div>

      {error && (
        <InfoCard type="error">
          <p className="text-sm">{error}</p>
        </InfoCard>
      )}

      <Button
        onClick={handleGenerateList}
        disabled={!isFormValid() || loading}
        className="w-full py-4 shadow-card hover:shadow-lg"
        icon={loading ? null : "Sparkles"}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating List...</span>
          </>
        ) : (
          <span>Generate Packing List</span>
        )}
      </Button>
    </motion.div>
  );
}

export default TripForm;