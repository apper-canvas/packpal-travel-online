import React from 'react';

function Spinner({ className = 'h-12 w-12', color = 'border-primary' }) {
  return (
    <div className={`animate-spin rounded-full ${className} border-b-2 ${color} mx-auto`}></div>
  );
}

export default Spinner;