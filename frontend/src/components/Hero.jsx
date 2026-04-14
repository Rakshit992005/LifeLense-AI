import React from 'react';

const Hero = () => {
  return (
    <section className="w-full relative overflow-hidden bg-white pt-20 pb-28 border-b border-gray-100">
      
      {/* Abstract background gradient decorations */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-70 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-70 z-0 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-fadeIn">
          
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-[var(--primary-color)] px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-2 border border-blue-100">
            <span className="flex w-2 h-2 rounded-full bg-[var(--primary-color)] animate-ping"></span>
            <span>Healthcare Hackathon MVP</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[var(--text-color)] tracking-tight leading-tight">
            Understand your medical reports <span className="text-[var(--primary-color)] block mt-2">instantly.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Upload complex clinical documents and let AI translate medical jargon into plain English. Spot anomalies effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <a href="#upload" className="bg-[var(--primary-color)] hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center">
              Upload Report
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
            <a href="#how-it-works" className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center">
              See How It Works
            </a>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-40 scroll-mt-24">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-[var(--text-color)]">Three steps to health clarity</h2>
          <div className="grid md:grid-cols-3 gap-10">
            
            {/* Step 1 */}
            <div className="bg-[var(--card-color)] p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-blue-50 text-[var(--primary-color)] rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-3 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Upload Report</h3>
              <p className="text-gray-500 leading-relaxed">Securely drop your PDF or image report. We support standard lab and diagnostic formats.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[var(--card-color)] p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-emerald-50 text-[var(--secondary-color)] rounded-2xl flex items-center justify-center mb-6 transform group-hover:-rotate-3 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. AI Analysis</h3>
              <p className="text-gray-500 leading-relaxed">Our model instantly extracts medical data, identifies anomalies, and simplifies terminology.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[var(--card-color)] p-8 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-red-50 text-[var(--accent-color)] rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-3 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Get Insights</h3>
              <p className="text-gray-500 leading-relaxed">Receive a clean, organized summary with highlighted risks and personalized wellness tips.</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
