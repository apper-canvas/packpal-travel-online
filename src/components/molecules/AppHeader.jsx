import React from 'react';
import { motion } from 'framer-motion';
import AppLogo from '../atoms/AppLogo';
import Button from '../atoms/Button';

function AppHeader({ onNewTripClick }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AppLogo />
          <Button onClick={onNewTripClick} icon="Plus" className="px-4 py-2">
            <span className="hidden sm:inline">New Trip</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;