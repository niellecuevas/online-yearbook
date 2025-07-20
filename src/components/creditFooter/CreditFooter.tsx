import React from 'react';

const teamMembers = [
  { name: 'Maureen Lozares', role: 'Project Manager', link: 'https://www.linkedin.com/in/maureenlzrs/' },
  { name: 'Ivan Medrano', role: 'Frontend Developer', link: 'https://www.linkedin.com/in/medrano-ivan-b57509276/' },
  { name: 'Don Daniel Gube', role: 'Frontend Developer', link: 'https://www.linkedin.com/in/don-daniell-gube/' },
  { name: 'Raniella Cuevas', role: 'Fullstack Developer', link: 'https://www.linkedin.com/in/raniellacuevas' },
  { name: 'John Lorenz Mayo', role: 'Fullstack Developer', link: 'https://github.com/enzouro' },
];

const CreditFooter = () => {
  return (
    <footer className="w-full bg-[#004030]/90 text-[#FAF3E0] py-12 backdrop-blur-md border-t border-[#FAF3E0]/20 shadow-inner">
      <div className="max-w-6xl mx-auto px-6">
        
     

       

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl font-bold tracking-wider mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Developed with ❤️ by
          </h2>
          <p className="text-sm text-[#FAF3E0]/80 italic">
            The team behind <span className="text-[#F8B259] font-medium">BAcked Up: The 02 Files</span>
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 justify-items-center text-center">
          {teamMembers.map((member, index) => (
            <a
              key={index}
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-200 hover:scale-105"
            >
              <div className="font-semibold group-hover:text-[#F8B259]">{member.name}</div>
              <div className="text-sm text-[#FAF3E0]/70 italic">{member.role}</div>
            </a>
          ))}
        </div>

        <hr className="border-t border-[#F8B259]/30 w-3/4 mx-auto mt-10 mb-2" />

        {/* End Statement */}
           <p className="mb-8 text-center text-[#FAF3E0] text-base sm:text-lg italic max-w-2xl mx-auto px-4 leading-relaxed font-light">
          Like a website built from scratch, our journey was <span className="text-[#F8B259] font-medium">coded with trust</span>, <span className="text-[#F8B259] font-medium">designed with laughter</span>, and <span className="text-[#F8B259] font-medium">launched with love</span>.
        </p>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-[#FAF3E0]/60">
          © {new Date().getFullYear()} BAcked Up: The 02 Files. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default CreditFooter;
