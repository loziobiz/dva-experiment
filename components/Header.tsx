
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg className="h-8 w-8 text-amber-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a6.375 6.375 0 0 0 6.375-6.375a6.375 6.375 0 0 0-6.375-6.375a6.375 6.375 0 0 0-6.375 6.375a6.375 6.375 0 0 0 6.375 6.375Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.375a2.375 2.375 0 1 0 0-4.75a2.375 2.375 0 0 0 0 4.75Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h.008v.008h-.008V12Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h.008v.008H4.5V12Zm7.5 7.5h.008v.008h-.008v-.008Zm0-15h.008v.008h-.008V4.5Z" />
            </svg>
            <h1 className="text-2xl font-bold text-stone-800">
              DVA <span className="font-light text-stone-500 hidden sm:inline">| Drone Vision for Archaeology</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
