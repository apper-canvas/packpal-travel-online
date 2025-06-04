import React from 'react';

function Input({ label, type = 'text', value, onChange, placeholder, className = '', id, required = false }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className}`}
      />
    </div>
  );
}

export default Input;