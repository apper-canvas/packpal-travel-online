import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root
import Typography from '../atoms/Typography';

function FeatureCard({ iconName, iconColorClass, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay }}
      className="text-center space-y-4"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${iconColorClass}`}>
        <ApperIcon name={iconName} className="h-8 w-8 text-white" />
      </div>
      <Typography variant="h3" className="text-xl font-heading font-semibold">
        {title}
      </Typography>
      <Typography variant="p" className="text-surface-600">
        {description}
      </Typography>
    </motion.div>
  );
}

export default FeatureCard;