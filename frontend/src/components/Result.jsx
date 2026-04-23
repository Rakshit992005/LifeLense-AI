import React, { useState } from 'react';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';

const Result = ({ data }) => {
  const [showRawText, setShowRawText] = useState(false);

  if (!data) return null;

  const applyHighlights = (text, extractedValues, criticalAlerts) => {
    let processed = text;
    
    const wrapSpan = (content, bg, color) => `<span style="background:${bg}; color:${color}; font-weight:bold; padding:1px 4px; border-radius:3px;">${content}</span>`;

    const colors = {
      red: { bg: '#fee2e2', text: '#dc2626' },
      yellow: { bg: '#fef9c3', text: '#b45309' },
      green: { bg: '#dcfce7', text: '#16a34a' },
      blue: { bg: '#dbeafe', text: '#1d4ed8' }
    };

    if (criticalAlerts && criticalAlerts.length > 0) {
      criticalAlerts.forEach(alert => {
        if (!alert.parameter) return;
        const safeParam = alert.parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b(${safeParam})\\b`, 'gi');
        processed = processed.replace(regex, (match) => wrapSpan(match, colors.red.bg, colors.red.text));
      });
    }

    const yellowKeywords = ['borderline', 'slightly elevated', 'slightly low', 'mild', 'moderate', 'monitor', 'watch'];
    const yellowRegex = new RegExp(`([^\\n.!?]*(?:[.!?](?!\\s)[^\\n.!?]*)*\\b(?:${yellowKeywords.join('|')})\\b[^\\n.!?]*(?:[.!?](?!\\s)[^\\n.!?]*)*(?:[.!?]|$))`, 'gim');
    processed = processed.replace(yellowRegex, (match) => wrapSpan(match, colors.yellow.bg, colors.yellow.text));

    const greenKeywords = ['normal', 'desirable', 'optimal', 'healthy', 'within range', 'good'];
    const greenRegex = new RegExp(`\\b(${greenKeywords.join('|')})\\b`, 'gi');
    processed = processed.replace(greenRegex, (match) => wrapSpan(match, colors.green.bg, colors.green.text));

    const blueRegex = /\d+\.?\d*\s?(mg\/dL|g\/dL|mmol\/L|%|IU\/L|mEq\/L)/gi;
    processed = processed.replace(blueRegex, (match) => wrapSpan(match, colors.blue.bg, colors.blue.text));

    processed = processed.replace(/(Risk Level:\s*Low)/gi, (match) => wrapSpan(match, colors.green.bg, colors.green.text));
    processed = processed.replace(/(Risk Level:\s*Moderate)/gi, (match) => wrapSpan(match, colors.yellow.bg, colors.yellow.text));
    processed = processed.replace(/(Risk Level:\s*(High|Critical))/gi, (match) => wrapSpan(match, colors.red.bg, colors.red.text));

    return processed;
  };

  const highlightAnalysis = (text, extractedValues, criticalAlerts) => {
    if (!text) return 'No analysis available.';
    const processed = applyHighlights(text, extractedValues, criticalAlerts);
    return marked(processed);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    const addFooter = () => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("This report is AI-generated and for informational purposes only. Consult a qualified medical professional.", pageWidth / 2, pageHeight - 10, { align: "center" });
    };

    // --- Page 1 ---
    doc.setFontSize(24);
    doc.setTextColor(0, 51, 153); // Blue
    doc.setFont("helvetica", "bold");
    doc.text("LifeLense Report", margin, margin + 10);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    const dateStr = new Date().toLocaleString();
    doc.text(`Generated on: ${dateStr}`, margin, margin + 20);

    doc.setDrawColor(200);
    doc.line(margin, margin + 25, pageWidth - margin, margin + 25);

    let yPos = margin + 35;

    if (data.preprocessResult) {
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      const rType = data.preprocessResult.reportType || "general";
      doc.text(`Report Type: ${rType.charAt(0).toUpperCase() + rType.slice(1)}`, margin, yPos);
      yPos += 10;

      if (data.preprocessResult.extractedValues && data.preprocessResult.extractedValues.length > 0) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Parameter", margin, yPos);
        doc.text("Value", margin + 80, yPos);
        doc.text("Unit", margin + 120, yPos);
        yPos += 8;

        doc.setFont("helvetica", "normal");
        data.preprocessResult.extractedValues.forEach(val => {
          doc.text(val.name, margin, yPos);
          doc.text(val.value.toString(), margin + 80, yPos);
          doc.text(val.unit, margin + 120, yPos);
          yPos += 8;
        });
      }
    }

    yPos += 5;
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    if (data.criticalAlerts && data.criticalAlerts.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(200, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Critical Alerts", margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      data.criticalAlerts.forEach(alert => {
        doc.setFont("helvetica", "bold");
        doc.text(alert.parameter + ":", margin, yPos);
        doc.setFont("helvetica", "normal");
        
        const alertText = `${alert.value} - ${alert.message}`;
        const lines = doc.splitTextToSize(alertText, pageWidth - margin * 2 - 40);
        doc.text(lines, margin + 40, yPos);
        
        yPos += lines.length * 7 + 2;
      });
    }

    addFooter();

    // --- Page 2 ---
    doc.addPage();
    yPos = margin + 10;
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("MedGemma AI Analysis", margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Strip markdown
    const plainTextAnalysis = (data.analysis || "No analysis available.")
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/#/g, '');

    const highlightedRaw = applyHighlights(plainTextAnalysis, data.preprocessResult?.extractedValues, data.criticalAlerts);

    const tokens = [];
    const spanRegex = /<span style="background:(.*?); color:(.*?);[^>]*>(.*?)<\/span>/gi;
    let lastIndex = 0;
    let match;
    while ((match = spanRegex.exec(highlightedRaw)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ text: highlightedRaw.slice(lastIndex, match.index), color: null });
        }
        tokens.push({ text: match[3], color: match[2], bg: match[1] });
        lastIndex = spanRegex.lastIndex;
    }
    if (lastIndex < highlightedRaw.length) {
        tokens.push({ text: highlightedRaw.slice(lastIndex), color: null });
    }

    let cursorX = margin;
    let cursorY = yPos;
    const lineHeight = 6;
    const maxW = pageWidth - margin;
    
    tokens.forEach(token => {
        const chunks = token.text.split(/([ \n])/);
        
        if (token.color) {
            doc.setTextColor(token.color);
            doc.setFont("helvetica", "bold");
        } else {
            doc.setTextColor(0);
            doc.setFont("helvetica", "normal");
        }

        chunks.forEach(chunk => {
            if (chunk === '') return;
            if (chunk === '\n') {
                cursorX = margin;
                cursorY += lineHeight;
                return;
            }
            
            const w = doc.getTextWidth(chunk);
            
            if (chunk === ' ' && cursorX === margin) return;
            
            if (cursorX + w > maxW && chunk !== ' ') {
                cursorX = margin;
                cursorY += lineHeight;
                if (cursorY > pageHeight - margin) {
                    addFooter();
                    doc.addPage();
                    cursorY = margin + 10;
                    if (token.color) {
                        doc.setTextColor(token.color);
                        doc.setFont("helvetica", "bold");
                    } else {
                        doc.setTextColor(0);
                        doc.setFont("helvetica", "normal");
                    }
                }
            }
            
            if (token.bg && chunk.trim() !== '') {
                doc.setFillColor(token.bg);
                doc.rect(cursorX, cursorY - 4.5, w, lineHeight, 'F');
            }
            
            doc.text(chunk, cursorX, cursorY);
            cursorX += w;
        });
    });

    addFooter();

    doc.save("LifeLense_Report.pdf");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[var(--card-color)] rounded-3xl shadow-xl overflow-hidden mt-6 animate-fadeIn border border-gray-100">
      
      {/* Critical Alerts Banner */}
      {data.criticalAlerts && data.criticalAlerts.length > 0 && (
        <div className="bg-red-600 text-white p-6 animate-[pulse_2s_ease-in-out_infinite] shadow-md border-b-4 border-red-800">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-2xl font-black tracking-widest uppercase">Critical Values Detected</h2>
          </div>
          <ul className="space-y-3 font-bold pl-4 md:pl-12">
            {data.criticalAlerts.map((alert, index) => (
              <li key={index} className="text-lg flex flex-col md:flex-row md:items-center">
                <span className="bg-white text-red-600 px-3 py-1 rounded-md mr-3 mb-2 md:mb-0 uppercase text-sm tracking-wider inline-block">
                  {alert.parameter}
                </span>
                <span>
                  <span className="underline decoration-red-300 decoration-2">{alert.value}</span> — {alert.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Premium Header */}
      <div className="bg-[var(--text-color)] p-8 text-white flex flex-col md:flex-row md:items-start justify-between relative overflow-hidden">
        {/* Subtle patterned background or gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-block bg-[var(--primary-color)] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase shadow-sm">
            Analysis Complete
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Your Report Insights</h2>
          <p className="text-gray-400 mt-2 font-medium max-w-md">Our AI has distilled your medical document into clear, actionable information.</p>
        </div>
        
        {/* Status Badge & Download Button */}
        <div className="mt-6 md:mt-0 relative z-10 flex flex-col items-end space-y-4">
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
            <span className="font-semibold text-sm">Analyzed Successfully</span>
          </div>
          <button 
            onClick={generatePDF}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg transition-colors font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Grid Layout inside the Card */}
      <div className="p-8 md:p-10 space-y-10 text-[var(--text-color)]">
        
        {/* MedGemma Analysis */}
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm max-w-none">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-200 text-sm">
            <div className="flex items-center space-x-2">
              <span style={{background:'#fee2e2', color:'#dc2626', fontWeight:'bold', padding:'2px 8px', borderRadius:'4px'}}>🔴 Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{background:'#fef9c3', color:'#b45309', fontWeight:'bold', padding:'2px 8px', borderRadius:'4px'}}>🟡 Borderline</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{background:'#dcfce7', color:'#16a34a', fontWeight:'bold', padding:'2px 8px', borderRadius:'4px'}}>🟢 Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span style={{background:'#dbeafe', color:'#1d4ed8', fontWeight:'bold', padding:'2px 8px', borderRadius:'4px'}}>🔵 Lab Values</span>
            </div>
          </div>
          
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: highlightAnalysis(data.analysis, data.preprocessResult?.extractedValues, data.criticalAlerts) 
            }} 
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
