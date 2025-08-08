import React, { useState } from 'react';

const RoomUpload = () => {
  const [roomFile, setRoomFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setRoomFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!roomFile) {
      alert('No room file selected.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('roomsFile', roomFile);

    try {
      const response = await fetch('http://localhost:5001/api/upload/rooms', {
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
        alert(data.message || 'Room file uploaded successfully!');
        console.log(data);
      } else {
        const errorMessage = data.error || data.message || 'Failed to upload room file.';
        console.error('Error uploading room file:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Network error while uploading room file:', error);
      alert(`Network error: ${error.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="upload-card">
      <div className="file-icon">📄</div>
      <h3>Rooms File</h3>
      <input
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
        className="file-input"
        id="roomFile"
      />
      <label htmlFor="roomFile" className="upload-button">
        {roomFile ? roomFile.name : 'Choose File'}
      </label>
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={!roomFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default RoomUpload;