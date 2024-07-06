import React from 'react';

const DateInput = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default DateInput;
