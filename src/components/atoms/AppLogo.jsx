import React from 'react';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root

function AppLogo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
        <ApperIcon name="Luggage" className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-2xl font-heading font-bold text-surface-900">PackPal</h1>
    </div>
  );
}

export default AppLogo;