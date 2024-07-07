import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';

const StyledInput = styled.input`
  width: 98%;
  padding: 10px;
  margin: 5px 0;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  
  &:hover {
    border-color: ${lighten(0.2, '#ccc')};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    border-color: #0078d4;
    box-shadow: 0 0 5px rgba(0, 120, 212, 0.5);
    outline: none;
  }
`;

const StyledSelect = styled.select`
  width: 98%;
  padding: 10px;
  margin: 5px 0;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    border-color: ${lighten(0.2, '#ccc')};
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    border-color: #0078d4;
    box-shadow: 0 0 5px rgba(0, 120, 212, 0.5);
    outline: none;
  }
`;

const SearchableDropdown = ({ options, value, onChange, currentQuestionIndex, previousResponse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    let newFilteredOptions = options.filter(option =>
      option.OptionText.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Lógica de filtrado basada en ParentOptionID
    if (previousResponse) {
      newFilteredOptions = newFilteredOptions.filter(option =>
        option.ParentOptionID === previousResponse
      );
    }

    setFilteredOptions(newFilteredOptions);
  }, [options, searchTerm, previousResponse]);

  return (
    <div>
      <StyledInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <StyledSelect value={value} onChange={(e) => onChange(e.target.value)}>
        {filteredOptions.map(option => (
          <option key={option.OptionID} value={option.OptionText}>
            {option.OptionText}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

export default SearchableDropdown;
