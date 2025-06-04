import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root

function PackingItem({ item, onToggle, onDelete }) {
  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        item.isPacked 
          ? 'bg-success/5 border-success/20' 
          : 'bg-white border-surface-200 hover:border-surface-300'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            item.isPacked
              ? 'bg-success border-success text-white'
              : 'border-surface-300 hover:border-primary'
          }`}
        >
          {item.isPacked && <ApperIcon name="Check" className="h-4 w-4" />}
        </motion.button>
        
        <div className="flex-1">
          <span className={`${item.isPacked ? 'line-through text-surface-500' : 'text-surface-900'}`}>
            {item.name}
          </span>
          {item.quantity > 1 && (
            <span className="ml-2 text-sm text-surface-500">
              × {item.quantity}
            </span>
          )}
          {item.isCustom && (
            <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
              Custom
            </span>
          )}
        </div>
      </div>

      {item.isCustom && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(item.id)}
          className="text-surface-400 hover:text-red-500 transition-colors"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  );
}

export default PackingItem;