import React, { useState } from 'react';

const FixedSlotUpload = () => {
  const [fixedSlotFile, setFixedSlotFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFixedSlotFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fixedSlotFile) {
      alert('No fixed slot file selected.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('fixedSlotFile', fixedSlotFile);

    try {
      const response = await fetch('http://localhost:5001/api/upload/fixed-slots', {
        method: 'POST',
        body: formData,
        cache: 'no-cache',
        credentials: 'same-origin',
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { message: 'No response data' };
      }

      if (response.ok) {
        alert(data.message || 'Fixed slot file uploaded successfully!');
        console.log(data);
      } else {
        const errorMessage = data.error || data.message || 'Failed to upload fixed slot file.';
        console.error('Error uploading fixed slot file:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error while uploading fixed slot file:', error);
      alert(`Network error: ${error.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="upload-card">
      <div className="file-icon">📄</div>
      <h3>Fixed Slots File</h3>
      <input
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
        className="file-input"
        id="fixedSlotFile"
      />
      <label htmlFor="fixedSlotFile" className="upload-button">
        {fixedSlotFile ? fixedSlotFile.name : 'Choose File'}
      </label>
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={!fixedSlotFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FixedSlotUpload;