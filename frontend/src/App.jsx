import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Upload from './components/Upload';
import Loader from './components/Loader';
import Result from './components/Result';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setResultData(null);
    
    try {
      // 1. Prepare file in FormData to be sent to the backend
      const formData = new FormData();
      formData.append('report', file);

      // 2. Make actual HTTP request to backend
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error occurred during upload.');
      }

      setResultData({
        extractedText: data.extractedText,
        analysis: data.analysis
      });

    } catch (error) {
      console.error("Failed to upload:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsLoading(false);
      // Auto-scroll to results smoothly
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center">
        {/* Only show Hero on the initial page load when no upload logic is active */}
        {(!isLoading && !resultData) && <Hero />}

        {/* The core Application Workspace */}
        <div id="upload" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${(!isLoading && !resultData) ? 'py-16' : 'py-10'}`}>
          
          {/* Subtle header shown only when user is inside the app workflow */}
          {(isLoading || resultData) && (
             <div className="text-center mb-10 animate-fadeIn">
               <h2 className="text-3xl font-extrabold text-[var(--text-color)] tracking-tight">Document Analysis Workspace</h2>
               <p className="text-gray-500 mt-2 font-medium">Upload another document to start fresh.</p>
             </div>
          )}

          {/* Grid setup for Upload and Results (if both exist they can stack) */}
          <div className="flex flex-col items-center justify-center w-full">
            
            {/* The Upload Component */}
            <div className="w-full animate-fadeIn mb-8 z-10 relative">
               <Upload onUpload={handleUpload} />
            </div>

            {/* The Process State & Results View */}
            <div id="results-section" className="w-full relative z-20 mt-4">
              {isLoading && <Loader />}
              {!isLoading && resultData && <Result data={resultData} />}
            </div>

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-10 relative z-30">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          
          <div className="flex justify-center items-center space-x-2 text-[var(--text-color)] font-bold text-xl mb-4">
            LifeLense <span className="text-[var(--primary-color)] ml-1">AI</span>
          </div>

          <p className="font-semibold text-gray-500 mb-2">&copy; {new Date().getFullYear()} built for the Health AI Hackathon Demo.</p>
          
          <div className="flex items-center justify-center mt-2 text-xs font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <svg className="w-4 h-4 mr-1.5 text-[var(--accent-color)]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            <span>Generative AI insights are strictly for informational purposes, not clinical advice.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;