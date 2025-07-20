'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { FC, ReactNode, ForwardedRef } from 'react';

// --- TYPE DEFINITIONS ---
interface Student {
  name: string;
  imageUrl: string;
  motto: string;
  latinHonor?: string;
  itPassport?: boolean;
}

interface StudentProfileProps {
  name: string;
  imageUrl: string;
  motto: string;
  latinHonor?: string;
  itPassport?: boolean;
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
  { name: 'AGOJO, JILLIAN GAYLE M.', imageUrl: '/toga/Agojo.JPG', motto: 'Dream big, work hard', },
  { name: 'AGUILAR, ASHERA KATHRYN R.', imageUrl: '/toga/Aguilar.JPG', motto: 'Be the change you wish to see' },
  { name: 'ALVAREZ, IRISH JANE P.', imageUrl: '/toga/Alvarez.JPG', motto: 'Life is what happens when you\'re busy making plans', itPassport: true },
  { name: 'ATIENZA, KATE ANDREI R.', imageUrl: '/toga/Atienza.JPG', motto: 'Kindness is always fashionable', latinHonor: 'Cum Laude', itPassport: true },
  { name: 'BAUTISTA, CHRIS JOHN L.', imageUrl: '/toga/Bautista.JPG', motto: 'Adventure awaits around every corner' },
  { name: 'COMIA, MARIA ANDREA M.', imageUrl: '/toga/Comia.JPG', motto: 'Create your own sunshine', latinHonor: 'Cum Laude', itPassport: true},
  { name: 'CUENCA, KIM PAOLO R.', imageUrl: '/toga/Cuenca.JPG', motto: 'Stay curious, stay humble', latinHonor: 'Cum Laude', itPassport: true },
  { name: 'CUEVAS, RANIELLA R.', imageUrl: '/toga/Cuevas.JPG', motto: 'Believe in yourself and magic will happen', itPassport: true },
  { name: 'DE CASTRO, MC LAURENCE D.', imageUrl: '/toga/De Castro.JPG', motto: 'The best is yet to come' },
  { name: 'DE LA PEÑA, MARY ANN LEE D.', imageUrl: '/toga/Dela Pena.jpeg', motto: 'Live laugh love learn' },
  { name: 'DE LEON, MARIA ANDREA N.', imageUrl: '/toga/De Leon.JPG', motto: 'Make every moment count', itPassport: true },
  { name: 'DE VILLA, SIMONE LOUIS O.', imageUrl: '/toga/De Villa.JPG', motto: 'Embrace the journey' },
  { name: 'DULAY, VERONICA ANN', imageUrl: '/toga/Dulay.JPG', motto: 'Dare to be different' },
  { name: 'EBRADO, JED ENRIQUE M.', imageUrl: '/toga/Ebrado.JPG', motto: 'Spread positivity wherever you go' },
  { name: 'ENGGAY, RONALYN R.', imageUrl: 'https://placehold.co/150x150/8ecae6/023047?text=Enggay', motto: 'Chase your dreams fearlessly' },
  { name: 'EVANGELISTA, JHON MATTHEW E.', imageUrl: '/toga/Evangelista.JPG', motto: 'Be yourself; everyone else is taken', itPassport: true },
  { name: 'GARCIA, JELLO MARI C.', imageUrl: '/toga/Garcia.JPG', motto: 'Think outside the box' , latinHonor: 'Cum Laude', itPassport: true},
  { name: 'GUBE, DON DANIELL C.', imageUrl: '/toga/Gube.JPG', motto: 'Leave a little sparkle wherever you go', itPassport: true },
  { name: 'HERNANDEZ, MARC ANDREI L.', imageUrl: '/toga/Hernandez M.JPG', motto: 'Knowledge is power', itPassport: true },
  { name: 'HERNANDEZ, MARK JELO M.', imageUrl: '/toga/Hernandez J.JPG', motto: 'Work hard, play harder' },
  { name: 'ILAO, JHON KYLE P.', imageUrl: '/toga/Ilao.JPG', motto: 'Find beauty in everything', latinHonor: 'Cum Laude', itPassport: true },
  { name: 'KATIMBANG, CYRIL TIFFANY O.', imageUrl: '/toga/Katimbang.JPG', motto: 'Success is a journey, not a destination' },
  { name: 'LATADE, PATRICK JACOB H.', imageUrl: '/toga/Latade.JPG', motto: 'Keep moving forward', itPassport: true },
  { name: 'LOZARES, MAUREEN V.', imageUrl: '/toga/Lozares.JPG', motto: 'Excellence is not a skill, it\'s an attitude', latinHonor: 'Cum Laude', itPassport: true },
  { name: 'MAMIIT, JOHN VICTOR', imageUrl: '/toga/Mamiit.JPG', motto: 'Be the light in someone\'s darkness' },
  { name: 'MANIGBAS, QUEENIE ANGELOU V.', imageUrl: '/toga/Manigbas.JPG', motto: 'Dream it, believe it, achieve it' },
  { name: 'MAULEON, ARABELLA LOIS P.', imageUrl: '/toga/Mauleon.JPG', motto: 'Curiosity never killed anything except ignorance',  },
  { name: 'MAYO, JOHN LORENZ Q.', imageUrl: '/toga/Mayo.JPG', motto: 'Take chances, make mistakes, get messy' },
  { name: 'MEDRANO, IVAN D.', imageUrl: '/toga/Medrano.JPG', motto: 'Happiness is homemade' },
  { name: 'MENDOZA, HARVEY L.', imageUrl: '/toga/Mendoza.JPG', motto: 'Be bold, be brave, be you' },
  { name: 'MINDANAO, ERICKA MAE C.', imageUrl: '/toga/Mindanao.JPG', motto: 'Life is short, make it sweet' },
  { name: 'MONTEALTO, JUAN MIGUEL M.', imageUrl: '/toga/Montealto.JPG', motto: 'Stay strong, stay positive' },
  { name: 'PLOPENIO, EDBERT P.', imageUrl: '/toga/Plopenio.JPG', motto: 'Grace under pressure', latinHonor: 'Cum Laude', itPassport: true },
  { name: 'PUNZALAN, JHONATHAN T.', imageUrl: '/toga/Punzalan.JPG', motto: 'Adventure is out there' },
  { name: 'REYES, MARIA BETTY R.', imageUrl: '/toga/Reyes.JPG', motto: 'Bloom where you are planted' },
  { name: 'SANZ, ALECKXANDER M.', imageUrl: '/toga/Sanz.JPG', motto: 'Make it happen' },
  { name: 'SILANG, L-SON F.', imageUrl: '/toga/Silang.JPG', motto: 'Elegance is the only beauty that never fades' },
  { name: 'SUAREZ, IRISH LEAN C.', imageUrl: '/toga/Suarez.JPG', motto: 'Courage is not the absence of fear' },
  { name: 'TAPALLA, CYRUS E.', imageUrl: '/toga/Tapalla.JPG', motto: 'Small steps, big dreams', itPassport: true },
  { name: 'VALENCIA, DEXTER JAMES', imageUrl: '/toga/Valencia.JPG', motto: 'Navigate your own path' },
  { name: 'VILLANUEVA, CARLA ELIZA M.', imageUrl: '/toga/Villanueva.JPG', motto: 'Optimism is the faith that leads to achievement', latinHonor: 'Cum Laude', itPassport: true },
];

// --- COMPONENTS ---
const StudentProfile: FC<StudentProfileProps> = ({ name, imageUrl, motto, latinHonor, itPassport }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-start text-center h-full">
      <div 
        className="relative w-full h-56 bg-white rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden group mb-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={imageUrl} 
          alt={name} 
          className={`w-full h-full object-contain object-center transition-all duration-300 ${isHovered ? 'blur-sm' : ''}`}
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/120x128/e2e8f0/4a5568?text=Photo'; }}
        />
        
        {/* Motto overlay */}
        <div className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white text-sm font-semibold text-center leading-tight drop-shadow-lg bg-black bg-opacity-70 p-2 rounded">
            "{motto}"
          </p>
        </div>
      </div>
      
      {/* Fixed name and achievements container with consistent height */}
      <div className="h-20 flex flex-col items-center justify-center w-full px-1">
        <p className="text-sm font-semibold text-gray-700 leading-tight text-center mb-1">
          {name}
        </p>
        <div className="flex flex-col items-center space-y-1">
          {latinHonor && (
            <p className="text-xs italic text-red-600 font-medium">
              {latinHonor}
            </p>
          )}
          {itPassport && (
            <p className="text-xs italic text-blue-600 font-medium">
              IT Passport Passer
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Page = React.forwardRef<HTMLDivElement, PageProps>(({ children, number }, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <div className="bg-gray-50 border border-gray-300 flex justify-center items-center relative" ref={ref}>
      <div className="w-full h-full p-6">
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
  const studentsPerPage = 4; // 2 columns x 2 rows

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
      
      <div className="w-full max-w-4xl">
        {isClient ? (
          <HTMLFlipBook
            width={500}
            height={700}
            size="stretch"
            minWidth={400}
            maxWidth={650}
            minHeight={500}
            maxHeight={900}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            ref={bookRef}
            className="mx-auto rounded-lg"
          >
            {/* Cover Page */}
            <Page number={0}>
              <div className="flex flex-col items-center justify-center h-full bg-red-800 text-white">
                <div className="w-full max-w-md">
                  <img src="/images/classpic.webp" alt="School Logo" className="w-full h-auto rounded-lg mb-4" />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Class of 2025</h2>
                <p className="text-lg opacity-90">Yearbook</p>
              </div>
            </Page>

            {/* Student pages */}
            {studentPages.map((pageStudents, pageIndex) => (
              <Page key={pageIndex} number={pageIndex + 1}>
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full content-center py-4">
                  {pageStudents.map((student, studentIndex) => (
                    <StudentProfile 
                      key={studentIndex} 
                      name={student.name} 
                      imageUrl={student.imageUrl} 
                      motto={student.motto} 
                      latinHonor={student.latinHonor}
                      itPassport={student.itPassport}
                    />
                  ))}
                </div>
              </Page>
            ))}

            {/* Back Cover */}
            <Page number={totalPages}>
              <div className="flex flex-col items-center justify-center h-full bg-red-800 text-white">
                <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The End</h2>
                <p className="text-lg opacity-90">Thank you for the memories</p>
                <p className="text-sm opacity-75 mt-4">Class of 2025</p>
              </div>
            </Page>
          </HTMLFlipBook>
        ) : (
          // Loading placeholder that matches the expected dimensions
          <div className="mx-auto rounded-lg bg-gray-800 flex items-center justify-center" style={{ width: 500, height: 700 }}>
            <div className="text-white text-lg">Loading yearbook...</div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center space-x-6">
        <button 
          onClick={goToPrevPage}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-600"
          disabled={currentPage === 0 || !isClient}
        >
          Previous
        </button>
        <div className="text-white text-lg font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <button 
          onClick={goToNextPage}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Yearbook;