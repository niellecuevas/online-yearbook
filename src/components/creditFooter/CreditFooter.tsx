import React from 'react';

const teamMembers = [
  { name: 'Maureen Lozares', role: 'Project Manager', link: 'https://www.linkedin.com/in/maureenlzrs/' },
  { name: 'Ivan Medrano', role: 'Frontend Developer', link: 'https://github.com/teammate1' },
  { name: 'Don Daniel Gube', role: 'Frontend Developer', link: 'https://github.com/teammate2' },
  { name: 'Raniella Cuevas', role: 'Fullstack Developer', link: 'www.linkedin.com/in/raniellacuevas' },
  { name: 'John Lorenz Mayo', role: 'Fullstack Developer', link: 'https://github.com/teammate4' },
  // Add more teammates with roles here
];

const CreditFooter = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-md text-white py-12 shadow-inner border-t border-white/20 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-wide mb-2">Developed with ❤️ by</h2>
          <p className="text-sm text-white/70">Meet the amazing team behind Saranggola Yearbook</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center text-sm">
          {teamMembers.map((member, index) => (
            <a
              key={index}
              href={member.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F8B259] transition duration-200 text-center"
            >
              <div className="font-semibold hover:underline">{member.name}</div>
              <div className="text-white/70 text-xs">{member.role}</div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Saranggola Yearbook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default CreditFooter;
