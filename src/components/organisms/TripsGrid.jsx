import React from 'react';
import { motion } from 'framer-motion';
import TripCard from '../molecules/TripCard';

function TripsGrid({ trips, onDeleteTrip }) {
  if (!trips || trips.length === 0) {
    return null; // Render nothing if no trips, handled by EmptyState in parent
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onDeleteTrip={onDeleteTrip}
        />
      ))}
    </div>
  );
}

export default TripsGrid;