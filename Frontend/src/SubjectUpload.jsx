import React, { useState } from 'react';

const SubjectUpload = ({ onUpload, uploading }) => {
  const [subjectFile, setSubjectFile] = useState(null);

  return (
    <div className="upload-card">
      <div className="file-icon">📄</div>
      <h3>Subjects File</h3>
      <input
        type="file"
        accept=".xls,.xlsx,.csv"
        onChange={(e) => setSubjectFile(e.target.files[0])}
        className="file-input"
        id="subjectFile"
      />
      <label htmlFor="subjectFile" className="upload-button">
        {subjectFile ? subjectFile.name : 'Choose File'}
      </label>
      <button
        onClick={() => onUpload(subjectFile, 'subjects')}
        className="upload-button"
        disabled={!subjectFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default SubjectUpload;