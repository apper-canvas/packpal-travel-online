import React from 'react';

function Tag({ children, className = '' }) {
  return (
    <span className={`bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {children}
    </span>
  );
}

export default Tag;