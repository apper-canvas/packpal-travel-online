import React from 'react';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

function FormField({ label, type = 'text', value, onChange, placeholder, options, id, required = false, className = '' }) {
  if (type === 'select') {
    return (
      <Select
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        className={className}
      />
    );
  }

  return (
    <Input
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  );
}

export default FormField;