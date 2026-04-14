import React from 'react';

const Loader = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--card-color)] rounded-3xl shadow-xl p-16 text-center border border-gray-100 flex flex-col items-center justify-center my-10 relative overflow-hidden">
      
      {/* Background sweep animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent w-[200%] animate-[spin_3s_linear_infinite] z-0 pointer-events-none"></div>

      <div className="relative inline-block mb-8 z-10">
        {/* Outer tracks */}
        <div className="w-24 h-24 border-4 border-blue-50 rounded-full"></div>
        <div className="w-24 h-24 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        
        {/* Inner static medical icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[var(--primary-color)]">
          <svg className="w-10 h-10 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
      
      <h3 className="text-3xl font-extrabold text-[var(--text-color)] mb-3 tracking-tight z-10 animate-pulse">Analyzing logic...</h3>
      <p className="text-gray-500 font-medium text-lg z-10">Extracting parameters and cross-referencing health databases.</p>

      {/* Progress Fake Bar */}
      <div className="w-64 h-2 bg-gray-100 rounded-full mt-8 overflow-hidden z-10">
        <div className="h-full bg-[var(--primary-color)] rounded-full animate-[progress_2.5s_ease-out_forwards]"></div>
      </div>

    </div>
  );
};

export default Loader;
