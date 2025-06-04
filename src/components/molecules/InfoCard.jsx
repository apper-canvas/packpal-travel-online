import React from 'react';

function InfoCard({ children, type = 'info', className = '' }) {
  const baseClasses = "rounded-xl p-4 mb-6";
  const typeClasses = {
    info: "bg-blue-50 border border-blue-200 text-blue-600",
    error: "bg-red-50 border border-red-200 text-red-600",
    success: "bg-green-50 border border-green-200 text-green-600"
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {children}
    </div>
  );
}

export default InfoCard;