"use client";
import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 py-4 bg-[#8B4513]/95 backdrop-blur-md shadow-md">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
      <div className="text-2xl font-bold text-[#FFF8E7] tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif" }}>
        <span className="text-amber-400">BA</span>cked Up: The <span className="text-amber-400">02</span> Files
      </div>
        <div className="flex gap-8">
          {['#messages', '#yearbook'].map((href, index) => {
            const text = ['Messages', 'Yearbook'][index];
            return (
              <a
                key={href}
                href={href}
                className="relative text-white text-xl font-medium hover:text-[#F8B259] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {text}
                <span className="absolute bottom-[-5px] text-xl left-0 w-0 h-[2px] bg-[#F8B259] transition-all duration-300 hover:w-full" style={{ fontFamily: "'Playfair Display', serif" }}></span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
