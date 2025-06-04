import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root
import PackingProgress from '../molecules/PackingProgress';
import Typography from '../atoms/Typography';
import TripForm from './TripForm';
import PackingListSection from './PackingListSection';

function NewTripFlow({ onTripCreated, onCancel }) {
  const [step, setStep] = useState(1);
  const [packingList, setPackingList] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  const categories = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Accessories', 'Other'];

  const handleTripGenerationComplete = (list) => {
    setPackingList(list);
    setStep(2);
  };

  const handleTripCreatedInternal = (trip) => {
    setCurrentTrip(trip);
    onTripCreated(trip); // Pass the newly created trip up to Home
  };

  const totalItems = packingList ? packingList.totalItems : 0; // Needs to be derived from items loaded in PackingListSection
  const packedItems = packingList ? packingList.packedItems : 0; // Needs to be derived from items loaded in PackingListSection
  const completionPercentage = packingList ? packingList.completionPercentage : 0;

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
              <Typography variant="h2">
                {step === 1 ? "Plan Your Trip" : "Your Packing List"}
              </Typography>
              <Typography variant="p" className="text-white/80">
                {step === 1 
                  ? "Tell us about your destination and we'll create a perfect packing list"
                  : "Check off items as you pack them"
                }
              </Typography>
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

          {step === 2 && packingList && (
            <PackingProgress 
              packedItems={packingList.completionPercentage > 0 ? Math.round((packingList.completionPercentage * (packingList.totalItems || 1)) / 100) : 0} 
              totalItems={packingList.totalItems || 0} 
              completionPercentage={packingList.completionPercentage || 0} 
            />
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <TripForm
                onTripCreated={handleTripCreatedInternal}
                onGenerationComplete={handleTripGenerationComplete}
              />
            ) : (
              <PackingListSection
                packingList={packingList}
                categories={categories}
                onTripCompletion={() => { /* maybe update a global state or show a confetti */ }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default NewTripFlow;