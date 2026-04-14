import React from 'react';

const Result = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--card-color)] rounded-3xl shadow-xl overflow-hidden mt-6 animate-fadeIn border border-gray-100">
      
      {/* Premium Header */}
      <div className="bg-[var(--text-color)] p-8 text-white flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden">
        {/* Subtle patterned background or gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-block bg-[var(--primary-color)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase shadow-sm">
            Analysis Complete
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Your Report Insights</h2>
          <p className="text-gray-400 mt-2 font-medium max-w-md">Our AI has distilled your medical document into clear, actionable information.</p>
        </div>
        
        {/* Status Badge */}
        <div className="mt-6 md:mt-0 relative z-10 flex items-center space-x-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
          <span className="font-semibold text-sm">Analyzed Successfully</span>
        </div>
      </div>

      {/* Grid Layout inside the Card */}
      <div className="p-8 md:p-10 space-y-10 text-[var(--text-color)]">
        
        {/* Top: Summary Section */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Executive Summary</h3>
          </div>
          <p className="text-gray-700 leading-relaxed font-medium md:pl-16 md:text-lg">
            {data.summary || "No summary available."}
          </p>
        </section>

        {/* Middle: Anomalies and Suggestions Layout side-by-side on desktop */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Abnormalities / Anomalies */}
          <section className="p-6 rounded-2xl border border-red-100 bg-red-50/30 flex flex-col h-full shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-2.5 rounded-xl text-[var(--accent-color)] shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Attention Required</h3>
            </div>
            
            {data.abnormalValues && data.abnormalValues.length > 0 ? (
              <ul className="space-y-4 flex-1">
                {data.abnormalValues.map((item, index) => (
                  <li key={index} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-red-50 text-[var(--accent-color)] font-semibold group cursor-default hover:border-red-200 transition-colors">
                    <span className="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">!</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-5 rounded-xl flex flex-col items-center justify-center text-center flex-1 h-full font-medium">
                <svg className="w-10 h-10 mb-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Excellent! No abnormal values detected in this report.
              </div>
            )}
          </section>

          {/* Health Suggestions */}
          <section className="p-6 rounded-2xl border border-blue-100 bg-emerald-50/30 flex flex-col h-full shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-[var(--secondary-color)] shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Actionable Steps</h3>
            </div>
            
            {data.suggestions && data.suggestions.length > 0 ? (
              <div className="flex flex-col gap-4 flex-1">
                {data.suggestions.map((item, index) => (
                  <div key={index} className="bg-white border border-emerald-100 p-4 rounded-xl flex items-start shadow-sm hover:border-emerald-200 transition-colors cursor-default">
                    <div className="bg-emerald-100 text-[var(--secondary-color)] rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm mr-4 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific suggestions generated. Consult your doctor.</p>
            )}
          </section>
          
        </div>
      </div>
      
      {/* Card Footer action point */}
      <div className="bg-gray-50 border-t border-gray-100 p-6 text-center text-sm font-medium text-gray-500">
        Review with your primary healthcare provider before making any lifestyle changes.
      </div>

    </div>
  );
};

export default Result;
