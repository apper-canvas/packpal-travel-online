import React from 'react';
import { motion } from 'framer-motion';
import Typography from '../atoms/Typography';

function HeroSection() {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <Typography variant="h1">
          Pack Smart,
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Travel Better
          </span>
        </Typography>
        <Typography variant="p" className="max-w-2xl mx-auto">
          Generate personalized packing lists based on your destination, weather, and trip type. 
          Never forget the essentials again.
        </Typography>
      </motion.div>
    </div>
  );
}

export default HeroSection;