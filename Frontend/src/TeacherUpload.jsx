import React, { useState } from 'react';

const TeacherUpload = ({ onUpload, uploading }) => {
  const [teacherFile, setTeacherFile] = useState(null);

  return (
    <div className="upload-card">
      <div className="file-icon">📄</div>
      <h3>Teachers File</h3>
      <input
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={(e) => setTeacherFile(e.target.files[0])}
        className="file-input"
        id="teacherFile"
      />
      <label htmlFor="teacherFile" className="upload-button">
        {teacherFile ? teacherFile.name : 'Choose File'}
      </label>
      <button
        onClick={() => onUpload(teacherFile, 'teachers')}
        className="upload-button"
        disabled={!teacherFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default TeacherUpload;