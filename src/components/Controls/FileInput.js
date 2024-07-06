import React from 'react';

const FileInput = ({ accept, onChange }) => {
  return (
    <input
      type="file"
      accept={accept}
      onChange={(e) => onChange(e.target.files[0])}
    />
  );
};

export default FileInput;