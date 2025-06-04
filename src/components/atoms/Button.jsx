import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon'; // Assuming ApperIcon is in the same 'components' root

function Button({ children, icon, className = '', onClick, disabled, type = 'button', variant = 'primary' }) {
  const baseClasses = "rounded-xl font-medium shadow-card hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2";
  
  const variantClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/5",
    ghost: "bg-transparent text-primary hover:bg-primary/5",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {icon && <ApperIcon name={icon} className="h-5 w-5" />}
      {children}
    </motion.button>
  );
}

export default Button;