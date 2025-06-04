import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root
import Tag from '../atoms/Tag';

function TripCard({ trip, onDeleteTrip }) {
  return (
    <motion.div
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
          onClick={() => onDeleteTrip(trip.id)}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ApperIcon name="Trash2" className="h-4 w-4 text-white" />
        </motion.button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Tag>{trip.tripType}</Tag>
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
  );
}

export default TripCard;