import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-[var(--card-color)] border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gradient-to-br from-[var(--primary-color)] to-blue-500 p-2 rounded-xl text-white shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-[var(--text-color)] block">
              LifeLense <span className="text-[var(--primary-color)]">AI</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <a href="#how-it-works" className="text-gray-500 hover:text-[var(--primary-color)] transition-colors">How it Works</a>
            <a href="#upload" className="text-gray-500 hover:text-[var(--primary-color)] transition-colors">Analyzer</a>
            <a href="#upload" className="bg-blue-50 text-[var(--primary-color)] px-5 py-2.5 rounded-lg hover:bg-blue-100 transition-colors">
              Try Demo
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
