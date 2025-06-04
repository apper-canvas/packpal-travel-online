import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';

function EmptyState({ onCtaClick, title, description, iconName, ctaText }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={iconName} className="h-16 w-16 text-primary" />
      </div>
      <Typography variant="h3" className="mb-2">
        {title}
      </Typography>
      <Typography variant="p" className="mb-6 max-w-md mx-auto">
        {description}
      </Typography>
      <Button onClick={onCtaClick} className="px-8 py-3">
        {ctaText}
      </Button>
    </motion.div>
  );
}

export default EmptyState;