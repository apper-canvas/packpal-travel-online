import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '../molecules/FeatureCard';

function FeaturesGrid() {
  const features = [
    {
      iconName: 'Brain',
      iconColorClass: 'bg-gradient-to-br from-primary/10 to-primary/20',
      title: 'Smart Suggestions',
      description: 'AI-powered recommendations based on destination, weather, and trip type.',
      delay: 0.2
    },
    {
      iconName: 'CheckSquare',
      iconColorClass: 'bg-gradient-to-br from-secondary/10 to-secondary/20',
      title: 'Track Progress',
      description: 'Check off items as you pack and see your progress in real-time.',
      delay: 0.3
    },
    {
      iconName: 'Clock',
      iconColorClass: 'bg-gradient-to-br from-accent/10 to-accent/20',
      title: 'Last-Minute Reminders',
      description: 'Get essential reminders before departure so you never forget the basics.',
      delay: 0.4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          iconName={feature.iconName}
          iconColorClass={feature.iconColorClass}
          title={feature.title}
          description={feature.description}
          delay={feature.delay}
        />
      ))}
    </motion.div>
  );
}

export default FeaturesGrid;