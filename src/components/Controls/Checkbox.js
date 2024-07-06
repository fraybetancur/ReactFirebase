import React from 'react';

const Checkbox = ({ checked, onChange, label }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
      />
      <label>{label}</label>
    </div>
  );
};

export default Checkbox;