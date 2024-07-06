import React from 'react';

const RadioGroup = ({ options, value, onChange, name }) => {
  return (
    <div>
      {options.map((option) => (
        <div key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <label>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;
