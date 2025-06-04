import React from 'react';

function Select({ label, value, onChange, options, className = '', id }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      >
        {options.map(option => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;