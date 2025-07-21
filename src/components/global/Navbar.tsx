"use client";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { href: "#messages", label: "Messages" },
    { href: "#yearbook", label: "Yearbook" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 py-4 bg-[#8B4513]/95 backdrop-blur-md shadow-md">
      <div className="mx-auto px-5 justify-between items-center flex">
        {/* Title */}
        <a href="#top" className="block">
          <div
            className="text-2xl font-bold text-[#FFF8E7] tracking-wider"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-amber-400">BA</span>cked Up: The{" "}
            <span className="text-amber-400">02</span> Files
          </div>
        </a>
        {/* Nav-content */}
        {/* Desktop */}
        <div className="gap-8 hidden md:flex space-x-4">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="relative text-xl font-medium hover:text-[#F8B259] transition-colors duration-300"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {label}
              <span className="absolute bottom-[-5px] left-0 w-0 h-[2px] bg-[#F8B259] transition-all duration-300 hover:w-full"></span>
            </a>
          ))}
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-lg hover:bg-gray-700"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#8B4513] shadow-md flex flex-col items-center space-y-4 py-4 z-50 md:hidden">
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)} // close menu on click
                className="text-lg font-medium hover:text-[#F8B259] transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
