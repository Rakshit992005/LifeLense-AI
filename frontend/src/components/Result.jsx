import React, { useState } from 'react';
import { marked } from 'marked';

const Result = ({ data }) => {
  const [showRawText, setShowRawText] = useState(false);

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
        
        {/* MedGemma Analysis */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm max-w-none">
          <div 
            className="prose prose-blue"
            dangerouslySetInnerHTML={{ __html: marked(data.analysis || 'No analysis available.') }} 
          />
        </section>

        {/* Raw Extracted Text Accordion */}
        <section className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <button 
            className="w-full bg-gray-50 p-4 text-left font-bold text-gray-700 flex justify-between items-center hover:bg-gray-100 transition-colors"
            onClick={() => setShowRawText(!showRawText)}
          >
            Raw Extracted Text
            <span>{showRawText ? '▲' : '▼'}</span>
          </button>
          {showRawText && (
            <div className="p-6 bg-white overflow-x-auto text-sm text-gray-600 whitespace-pre-wrap font-mono">
              {data.extractedText || 'No text extracted.'}
            </div>
          )}
        </section>

      </div>
      
      {/* Card Footer action point */}
      <div className="bg-gray-50 border-t border-gray-100 p-6 text-center text-sm font-medium text-gray-500">
        Review with your primary healthcare provider before making any lifestyle changes.
      </div>

    </div>
  );
};

export default Result;
