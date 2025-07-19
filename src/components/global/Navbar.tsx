import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-[#8B4513]/95 backdrop-blur-md z-50 py-4 transition-all duration-300">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
        <div className="text-white font-serif font-semibold text-xl">
          Ben & Ben Yearbook
        </div>
        <div className="flex gap-8">
          <a
            href="#chalkboard"
            className="relative text-white font-medium hover:text-[#D2B48C] transition-colors duration-300"
          >
            Messages
            <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-[#D2B48C] transition-all duration-300 hover:w-full"></span>
          </a>
          <a
            href="#yearbook"
            className="relative text-white font-medium hover:text-[#D2B48C] transition-colors duration-300"
          >
            Yearbook
            <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-[#D2B48C] transition-all duration-300 hover:w-full"></span>
          </a>
          <a
            href="#developers"
            className="relative text-white font-medium hover:text-[#D2B48C] transition-colors duration-300"
          >
            Developers
            <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-[#D2B48C] transition-all duration-300 hover:w-full"></span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
