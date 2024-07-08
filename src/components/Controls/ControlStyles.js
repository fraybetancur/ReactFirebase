// ControlStyles.js
import styled from 'styled-components';
import { lighten } from 'polished';

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const StyledCheckbox = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${(props) => (props.checked ? '#0078d4' : '#fff')};
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px #0078d4;
  }

  ${HiddenCheckbox}:checked + & {
    background: #0078d4;
  }
`;

export const CheckboxLabel = styled.label`
  margin-left: 8px;
  font-size: 1rem;
`;

export const StyledInput = styled.input`
  width: 98%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;

  &:focus {
    border-color: #0078d4;
    outline: none;
  }
`;

export const StyledLabel = styled.label`
  display: block;
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #e9e9e9;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
`;

export const RadioGroupContainer = styled.div
  display: flex;
  flex-direction: column;
  width: 98%;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;

  input {
    margin-right: 10px;
  }
`;

export const Star = styled.span`
  font-size: 1.5rem;
  color: ${(props) => (props.filled ? '#FFD700' : '#ccc')};
  cursor: pointer;
`;

export const RatingContainer = styled.div`
  display: flex;
`;

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

export const DropdownList = styled.ul`
  position: absolute;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  margin-top: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const SignatureContainer = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
`;

export const ClearButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f5a626;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.8rem;

  &:hover {
    background: ${lighten(0.1, '#f5a626')};
  }
`;
