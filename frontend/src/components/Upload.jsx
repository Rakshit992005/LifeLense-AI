import React, { useState } from 'react';

const Upload = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--card-color)] rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 md:p-12 border border-gray-100 relative overflow-hidden">
      
      {/* Decorative top strip */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]"></div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--text-color)] tracking-tight">
          Upload Medical Report
        </h2>
        <p className="text-gray-500 mt-2 font-medium">We securely analyze your document and provide actionable insights.</p>
      </div>

      {/* Drag & Drop Target Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-in-out ${
          dragActive
            ? 'border-[var(--primary-color)] bg-blue-50/50 scale-105'
            : 'border-gray-200 hover:border-[var(--primary-color)] bg-gray-50/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className="bg-white p-4 rounded-full shadow-sm mb-2 text-[var(--primary-color)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="text-base text-gray-600">
            <p className="font-medium mb-1">
              Drag and drop your report here, or
            </p>
            <label className="text-[var(--primary-color)] font-bold cursor-pointer hover:underline">
              browse your files
              <input 
                type="file" 
                className="hidden" 
                onChange={handleChange} 
                accept=".pdf,.png,.jpg,.jpeg" 
              />
            </label>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">PDF</span>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">JPEG</span>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">PNG</span>
          </div>
        </div>
      </div>

      {/* Selected File Visibility */}
      {file && (
        <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-center justify-between border border-blue-100 shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="bg-white p-2 rounded-lg text-[var(--primary-color)] shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-800 truncate">{file.name}</span>
              <span className="text-xs text-gray-500 font-medium">Ready to process</span>
            </div>
          </div>
          <button 
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Remove file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleUploadClick}
        disabled={!file}
        className={`w-full mt-8 py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 flex justify-center items-center ${
          file 
            ? 'bg-[var(--primary-color)] hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span>Analyze Document</span>
        {file && (
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        )}
      </button>
    </div>
  );
};

export default Upload;
