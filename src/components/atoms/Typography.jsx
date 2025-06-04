import React from 'react';

function Typography({ variant, children, className = '' }) {
  const styles = {
    h1: "text-4xl md:text-6xl font-heading font-bold text-surface-900 leading-tight",
    h2: "text-2xl font-heading font-bold",
    h3: "text-xl font-heading font-semibold",
    p: "text-xl text-surface-600",
    span: "" // Default for span
  };

  const Component = variant || 'span';

  return (
    <Component className={`${styles[variant] || ''} ${className}`}>
      {children}
    </Component>
  );
}

export default Typography;