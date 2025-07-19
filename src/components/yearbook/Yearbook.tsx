'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { FC, ReactNode, ForwardedRef } from 'react';

// --- TYPE DEFINITIONS ---
interface Student {
  name: string;
  imageUrl: string;
  motto: string;
}

interface StudentProfileProps {
  name: string;
  imageUrl: string;
  motto: string;
}

interface PageProps {
  children: ReactNode;
  number: number;
}

interface FlipBookRef {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    getPageCount: () => number;
  };
}

// --- DYNAMIC IMPORT ---
const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
}) as any;

// --- MOCK DATA ---
const allStudents: Student[] = [
  { name: 'Ivan Medrno', imageUrl: 'https://placehold.co/150x150/a8dadc/1d3557?text=Alex', motto: 'Dream big, work hard' },
  { name: 'Brenda Smith', imageUrl: 'https://placehold.co/150x150/f1faee/e63946?text=Brenda', motto: 'Be the change you wish to see' },
  { name: 'Charles Brown', imageUrl: 'https://placehold.co/150x150/457b9d/f1faee?text=Charles', motto: 'Life is what happens when you\'re busy making plans' },
  { name: 'Diana Miller', imageUrl: 'https://placehold.co/150x150/1d3557/f1faee?text=Diana', motto: 'Kindness is always fashionable' },
  { name: 'Ethan Wilson', imageUrl: 'https://placehold.co/150x150/e63946/f1faee?text=Ethan', motto: 'Adventure awaits around every corner' },
  { name: 'Fiona Davis', imageUrl: 'https://placehold.co/150x150/a8dadc/1d3557?text=Fiona', motto: 'Create your own sunshine' },
  { name: 'George Clark', imageUrl: 'https://placehold.co/150x150/fca311/14213d?text=George', motto: 'Stay curious, stay humble' },
  { name: 'Hannah Lewis', imageUrl: 'https://placehold.co/150x150/e5e5e5/000000?text=Hannah', motto: 'Believe in yourself and magic will happen' },
  { name: 'Ian Walker', imageUrl: 'https://placehold.co/150x150/14213d/ffffff?text=Ian', motto: 'The best is yet to come' },
  { name: 'Julia Hall', imageUrl: 'https://placehold.co/150x150/000000/ffffff?text=Julia', motto: 'Live laugh love learn' },
  { name: 'Kevin Young', imageUrl: 'https://placehold.co/150x150/fca311/14213d?text=Kevin', motto: 'Make every moment count' },
  { name: 'Laura King', imageUrl: 'https://placehold.co/150x150/e5e5e5/000000?text=Laura', motto: 'Embrace the journey' },
  { name: 'Mason Scott', imageUrl: 'https://placehold.co/150x150/8ecae6/023047?text=Mason', motto: 'Dare to be different' },
  { name: 'Nora Green', imageUrl: 'https://placehold.co/150x150/219ebc/ffffff?text=Nora', motto: 'Spread positivity wherever you go' },
  { name: 'Oscar Adams', imageUrl: 'https://placehold.co/150x150/ffb703/023047?text=Oscar', motto: 'Chase your dreams fearlessly' },
  { name: 'Penelope Baker', imageUrl: 'https://placehold.co/150x150/fb8500/ffffff?text=Penelope', motto: 'Be yourself; everyone else is taken' },
  { name: 'Quinn Nelson', imageUrl: 'https://placehold.co/150x150/023047/ffffff?text=Quinn', motto: 'Think outside the box' },
  { name: 'Riley Carter', imageUrl: 'https://placehold.co/150x150/8ecae6/023047?text=Riley', motto: 'Leave a little sparkle wherever you go' },
  { name: 'Sophia Hill', imageUrl: 'https://placehold.co/150x150/219ebc/ffffff?text=Sophia', motto: 'Knowledge is power' },
  { name: 'Thomas Rivera', imageUrl: 'https://placehold.co/150x150/ffb703/023047?text=Thomas', motto: 'Work hard, play harder' },
  { name: 'Uma Vance', imageUrl: 'https://placehold.co/150x150/d9ed92/184e77?text=Uma', motto: 'Find beauty in everything' },
  { name: 'Victor Wright', imageUrl: 'https://placehold.co/150x150/b5e48c/1a759f?text=Victor', motto: 'Success is a journey, not a destination' },
  { name: 'Wendy Hill', imageUrl: 'https://placehold.co/150x150/99d98c/168aad?text=Wendy', motto: 'Keep moving forward' },
  { name: 'Xavier King', imageUrl: 'https://placehold.co/150x150/76c893/34a0a4?text=Xavier', motto: 'Excellence is not a skill, it\'s an attitude' },
  { name: 'Yara Scott', imageUrl: 'https://placehold.co/150x150/52b69a/577590?text=Yara', motto: 'Be the light in someone\'s darkness' },
  { name: 'Zane Adams', imageUrl: 'https://placehold.co/150x150/34a0a4/f4d35e?text=Zane', motto: 'Dream it, believe it, achieve it' },
  { name: 'Alice Roberts', imageUrl: 'https://placehold.co/150x150/168aad/ee9b00?text=Alice', motto: 'Curiosity never killed anything except ignorance' },
  { name: 'Ben Turner', imageUrl: 'https://placehold.co/150x150/1a759f/ca6702?text=Ben', motto: 'Take chances, make mistakes, get messy' },
  { name: 'Clara Phillips', imageUrl: 'https://placehold.co/150x150/184e77/bb3e03?text=Clara', motto: 'Happiness is homemade' },
  { name: 'David Campbell', imageUrl: 'https://placehold.co/150x150/d9ed92/ae2012?text=David', motto: 'Be bold, be brave, be you' },
  { name: 'Eva Parker', imageUrl: 'https://placehold.co/150x150/b5e48c/9b2226?text=Eva', motto: 'Life is short, make it sweet' },
  { name: 'Frank Evans', imageUrl: 'https://placehold.co/150x150/99d98c/3a0ca3?text=Frank', motto: 'Stay strong, stay positive' },
  { name: 'Grace Edwards', imageUrl: 'https://placehold.co/150x150/76c893/4361ee?text=Grace', motto: 'Grace under pressure' },
  { name: 'Henry Collins', imageUrl: 'https://placehold.co/150x150/52b69a/4cc9f0?text=Henry', motto: 'Adventure is out there' },
  { name: 'Ivy Stewart', imageUrl: 'https://placehold.co/150x150/34a0a4/f72585?text=Ivy', motto: 'Bloom where you are planted' },
  { name: 'Jack Sanchez', imageUrl: 'https://placehold.co/150x150/168aad/b5179e?text=Jack', motto: 'Make it happen' },
  { name: 'Kate Morris', imageUrl: 'https://placehold.co/150x150/1a759f/7209b7?text=Kate', motto: 'Elegance is the only beauty that never fades' },
  { name: 'Leo Rogers', imageUrl: 'https://placehold.co/150x150/184e77/560bad?text=Leo', motto: 'Courage is not the absence of fear' },
  { name: 'Mia Reed', imageUrl: 'https://placehold.co/150x150/d9ed92/480ca8?text=Mia', motto: 'Small steps, big dreams' },
  { name: 'Noah Cook', imageUrl: 'https://placehold.co/150x150/b5e48c/3a0ca3?text=Noah', motto: 'Navigate your own path' },
  { name: 'Olivia Morgan', imageUrl: 'https://placehold.co/150x150/99d98c/3f37c9?text=Olivia', motto: 'Optimism is the faith that leads to achievement' },
  { name: 'Paul Bell', imageUrl: 'https://placehold.co/150x150/76c893/4895ef?text=Paul', motto: 'Persist until something happens' },
  { name: 'Ruby Murphy', imageUrl: 'https://placehold.co/150x150/52b69a/4361ee?text=Ruby', motto: 'Rare and precious like a ruby' },
];
// funciton for fetching data

// --- COMPONENTS ---
const StudentProfile: FC<StudentProfileProps> = ({ name, imageUrl, motto }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center text-center">
      <div 
        className="relative w-full h-40 bg-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={imageUrl} 
          alt={name} 
          className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'blur-sm' : ''}`}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/4a5568?text=Photo'; }}
        />
        
        {/* Motto overlay */}
        <div className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white text-xs font-semibold text-center leading-tight drop-shadow-lg bg-transparent bg-opacity-50 p-2 rounded">
            "{motto}"
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-700 mt-2">{name}</p>
    </div>
  );
};

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ children, number }, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div className="bg-gray-50 border border-gray-300 flex justify-center items-center" ref={ref}>
      <div className="w-full h-full p-4">
        {children}
        <div className="absolute bottom-3 right-4 text-xs text-gray-400">
          {number}
        </div>
      </div>
    </div>
  );
});
Page.displayName = 'Page';

// --- MAIN YEARBOOK COMPONENT ---
const Yearbook: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const bookRef = useRef<FlipBookRef | null>(null);
  const studentsPerPage = 6;

  // Use effect to set client-side flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const studentPages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < allStudents.length; i += studentsPerPage) {
      pages.push(allStudents.slice(i, i + studentsPerPage));
    }
    return pages;
  }, []);

  const totalPages = studentPages.length + 1;

  const handleFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
  };

  const goToPrevPage = () => {
    bookRef.current?.pageFlip().flipPrev();
  };

  const goToNextPage = () => {
    bookRef.current?.pageFlip().flipNext();
  };

  return (
    <div className="bg-gray-900 min-h-screen w-full flex flex-col justify-center items-center p-4 font-sans">
      <h1 className="text-5xl font-bold text-white mb-2 tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>Our Yearbook</h1>
      <p className="text-lg text-gray-300 mb-8">Class of 2024</p>
      
      <div className="w-full max-w-6xl aspect-[2.5/1]">
        {isClient ? (
          <HTMLFlipBook
            width={600}
            height={500}
            size="stretch"
            minWidth={315}
            maxWidth={1200}
            minHeight={250}
            maxHeight={1000}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            ref={bookRef}
            className="mx-auto rounded-lg shadow-2xl"
          >
            {/* Cover Page */}
            <Page number={0}>
              <div className="flex flex-col items-center justify-center h-full bg-red-800 text-white">
                <img src="/images/classpic.webp" alt="School Logo" className="w-full" />
              </div>
            </Page>

            {/* Student pages */}
            {studentPages.map((pageStudents, pageIndex) => (
              <Page key={pageIndex} number={pageIndex + 1}>
                <div className="grid grid-cols-3 grid-rows-2 gap-4 h-full content-center">
                  {pageStudents.map((student, studentIndex) => (
                    <StudentProfile key={studentIndex} name={student.name} imageUrl={student.imageUrl} motto={student.motto} />
                  ))}
                </div>
              </Page>
            ))}

            {/* Back Cover */}
            <Page number={totalPages}>
              <div className="flex flex-col items-center justify-center h-full bg-red-800 text-white">
                <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>The End</h2>
              </div>
            </Page>
          </HTMLFlipBook>
        ) : (
          // Loading placeholder that matches the expected dimensions
          <div className="mx-auto rounded-lg shadow-2xl bg-gray-800 flex items-center justify-center" style={{ width: 600, height: 500 }}>
            <div className="text-white text-lg">Loading yearbook...</div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center space-x-6">
        <button 
          onClick={goToPrevPage}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-600"
          disabled={currentPage === 0 || !isClient}
        >
          Previous
        </button>
        <div className="text-white text-lg font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <button 
          onClick={goToNextPage}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-600"
          disabled={currentPage === totalPages || !isClient}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Yearbook;