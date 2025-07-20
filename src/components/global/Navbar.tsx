"use client";
import React, { useEffect, useState, useRef } from 'react';

const Navbar = () => {
  const [isTransparent, setIsTransparent] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to start a 3-second timer to fade to transparent
  const startFadeTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsTransparent(true);
    }, 3000);
  };

  useEffect(() => {
    // Start initial 3s delay on mount
    startFadeTimeout();

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY <= 20) {
        // We're at the top: show brown again, then fade after 3s
        setIsTransparent(false);
        startFadeTimeout();
      } else {
        // We're scrolling down: stay transparent
        setIsTransparent(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 py-4 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent backdrop-blur-md'
          : 'bg-[#8B4513]/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
        <div className="text-white font-serif font-semibold text-xl">
          Ben & Ben Yearbook
        </div>
        <div className="flex gap-8">
          {['#messages', '#yearbook'].map((href, index) => {
            const text = ['Messages', 'Yearbook'][index];
            return (
              <a
                key={href}
                href={href}
                className="relative text-white font-medium hover:text-[#F8B259] transition-colors duration-300"
              >
                {text}
                <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-[#F8B259] transition-all duration-300 hover:w-full"></span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
