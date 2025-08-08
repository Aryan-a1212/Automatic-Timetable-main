import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FixedSlotsFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setValidationMessage('');
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          setValidationMessage('File is empty.');
          return;
        }

        // Define required columns for FixedSlotsFile. Adjust as needed.
        const requiredColumns = ['division', 'day', 'period', 'teacher', 'room', 'subject']; 

        const actualColumns = Object.keys(json[0]);

        const missingColumns = requiredColumns.filter(col => !actualColumns.includes(col));

        if (missingColumns.length > 0) {
          setValidationMessage(`Missing required columns: ${missingColumns.join(', ')}`);
        } else {
          setValidationMessage('File uploaded and validated successfully!');
          console.log('Parsed Data:', json);
          // Here you can further process the valid data
        }
      };

      reader.onerror = () => {
        setValidationMessage('Error reading file.');
      };

      reader.readAsArrayBuffer(file);
    } else {
      setSelectedFile(null);
      setValidationMessage('');
    }
  };

  return (
    <div className="upload-card">
      <div className="file-icon"></div>
      <p>Fixed Slots File</p>
      <label htmlFor="fixed-slots-file-upload" className="upload-button">
        Upload File
      </label>
      <input
        id="fixed-slots-file-upload"
        type="file"
        accept=".csv, .xls, .xlsx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {selectedFile && <p>{selectedFile.name}</p>}
      {validationMessage && <p className="validation-message">{validationMessage}</p>}
    </div>
  );
};

export default FixedSlotsFile;