import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root

function TripOptionCard({ icon, label, value, isSelected, onClick, detail }) {
  const selectedClasses = isSelected
    ? 'border-primary bg-primary/5 text-primary'
    : 'border-surface-200 hover:border-surface-300';
  const detailClasses = isSelected ? 'text-primary/70' : 'text-surface-500';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(value)}
      className={`p-4 rounded-xl border-2 transition-all text-center ${selectedClasses}`}
    >
      <ApperIcon name={icon} className="h-6 w-6 mx-auto mb-2" />
      <div className="text-sm font-medium">{label}</div>
      {detail && <div className={`text-xs ${detailClasses}`}>{detail}</div>}
    </motion.button>
  );
}

export default TripOptionCard;