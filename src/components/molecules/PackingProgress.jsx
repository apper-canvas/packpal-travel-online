import React from 'react';
import { motion } from 'framer-motion';

function PackingProgress({ packedItems, totalItems, completionPercentage }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between text-sm mb-2">
        <span>Packing Progress</span>
        <span>{packedItems}/{totalItems} items</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 0.5 }}
          className="bg-white h-2 rounded-full"
        />
      </div>
    </div>
  );
}

export default PackingProgress;