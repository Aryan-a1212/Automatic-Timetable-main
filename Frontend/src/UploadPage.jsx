import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

const UploadPage = () => {
  const [teacherFile, setTeacherFile] = useState(null);
  const [subjectFile, setSubjectFile] = useState(null);
  const [roomFile, setRoomFile] = useState(null);
  const [fixedSlotFile, setFixedSlotFile] = useState(null);
  const [uploading, setUploading] = useState(false); // ✅ Track upload state
  const navigate = useNavigate();

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleUpload = async (file, type) => {
    if (!file) {
      alert('No file selected.');
      return;
    }

    setUploading(true); // ✅ Prevent double click

    const formData = new FormData();
    const fieldMap = {
      teachers: 'teachersFile',
      subjects: 'subjectsFile',
      rooms: 'roomsFile',
      'fixed-slots': 'fixedSlotFile',
    };

    const fieldName = fieldMap[type];
    if (!fieldName) {
      alert('Invalid upload type');
      setUploading(false);
      return;
    }

    formData.append(fieldName, file);

    try {
      const response = await fetch(`http://localhost:5001/api/upload/${type}`, {
        method: 'POST',
        body: formData,
        cache: 'no-cache', // ✅ prevent stale form
        credentials: 'same-origin',
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        data = { message: 'No response data' };
      }

      if (response.ok) {
        alert(data.message || 'File uploaded successfully!');
        console.log(data);
      } else {
        const errorMessage = data.error || data.message || `Failed to upload ${type} file.`;
        console.error(`Error uploading ${type} file:`, errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error(`Network error while uploading ${type} file:`, error);
      alert(`Network error: ${error.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="upload-page-container">
      <h1>Upload Your Timetable Data</h1>
      <div className="upload-sections">
        {/* Teachers */}
        <UploadCard
          title="Teachers File"
          file={teacherFile}
          id="teacherFile"
          setFile={setTeacherFile}
          onUpload={() => handleUpload(teacherFile, 'teachers')}
          uploading={uploading}
        />

        {/* Subjects */}
        <UploadCard
          title="Subjects File"
          file={subjectFile}
          id="subjectFile"
          setFile={setSubjectFile}
          onUpload={() => handleUpload(subjectFile, 'subjects')}
          uploading={uploading}
        />

        {/* Rooms */}
        <UploadCard
          title="Rooms File"
          file={roomFile}
          id="roomFile"
          setFile={setRoomFile}
          onUpload={() => handleUpload(roomFile, 'rooms')}
          uploading={uploading}
        />

        {/* Fixed Slots */}
        <UploadCard
          title="Fixed Slots File"
          file={fixedSlotFile}
          id="fixedSlotFile"
          setFile={setFixedSlotFile}
          onUpload={() => handleUpload(fixedSlotFile, 'fixed-slots')}
          uploading={uploading}
        />
      </div>

      <button className="next-step-button" onClick={() => navigate('/timetable')}>
        Next Step →
      </button>
    </div>
  );
};

// ✅ Separated reusable card
const UploadCard = ({ title, file, id, setFile, onUpload, uploading }) => (
  <div className="upload-card">
    <div className="file-icon">📄</div>
    <h3>{title}</h3>
    <input
      type="file"
      accept=".xls,.xlsx,.csv"
      onChange={(e) => setFile(e.target.files[0])}
      className="file-input"
      id={id}
    />
    <label htmlFor={id} className="upload-button">
      {file ? file.name : 'Choose File'}
    </label>
    <button
      onClick={onUpload}
      className="upload-button"
      disabled={!file || uploading}
    >
      {uploading ? 'Uploading...' : 'Upload'}
    </button>
  </div>
);

export default UploadPage;
