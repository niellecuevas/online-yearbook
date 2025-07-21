"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import type { FC, ReactNode, ForwardedRef } from "react";
import Image from "next/image";
// Adjust path as needed

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
const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as any;

// --- MOCK DATA ---
const allStudents: Student[] = [
  {
    name: "AGOJO, JILLIAN GAYLE M.",
    imageUrl: "/toga/Agojo.JPG",
    motto: "Dream big, work hard",
  },
  {
    name: "AGUILAR, ASHERA KATHRYN R.",
    imageUrl: "/toga/Aguilar.JPG",
    motto:
      "01000111 01101100 01101111 01110010 01111001 00100000 01110100 01101111 00100000 01000111 01101111 01100100",
  },
  {
    name: "ALVAREZ, IRISH JANE P.",
    imageUrl: "/toga/Alvarez.JPG",
    motto: "Nasa Diyos ang awa, nasa akin ang mwa mwa",
    itPassport: true,
  },
  {
    name: "ATIENZA, KATE ANDREI R.",
    imageUrl: "/toga/Atienza.JPG",
    motto: "Overthink Responsibly",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "BAUTISTA, CHRIS JOHN L.",
    imageUrl: "/toga/Bautista.JPG",
    motto: "Adventure awaits around every corner",
  },
  {
    name: "COMIA, MARIA ANDREA M.",
    imageUrl: "/toga/Comia.JPG",
    motto: "Create your own sunshine",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "CUENCA, KIM PAOLO R.",
    imageUrl: "/toga/Cuenca.JPG",
    motto:
      "Living proof that debugging and drunk texting have the same success rate.",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "CUEVAS, RANIELLA R.",
    imageUrl: "/toga/Cuevas.JPG",
    motto: "Grind, Grind, Grind",
    itPassport: true,
  },
  {
    name: "DE CASTRO, MC LAURENCE D.",
    imageUrl: "/toga/De Castro.JPG",
    motto: "The best is yet to come",
  },
  {
    name: "DE LA PEÑA, MARY ANN LEE D.",
    imageUrl: "/toga/Dela Pena.jpeg",
    motto: "The journey doesn't end here it simply changes direction.",
  },
  {
    name: "DE LEON, MARIA ANDREA N.",
    imageUrl: "/toga/De Leon.JPG",
    motto: "We Came. We Learned. We\’re (Kinda) Ready.",
    itPassport: true,
  },
  {
    name: "DE VILLA, SIMONE LOUIS O.",
    imageUrl: "/toga/De Villa.JPG",
    motto: "I have no idea what\’s next, but at least I have my diploma.",
  },
  {
    name: "DULAY, VERONICA ANN",
    imageUrl: "/toga/Dulay.JPG",
    motto: "Dare to be different",
  },
  {
    name: "EBRADO, JED ENRIQUE M.",
    imageUrl: "/toga/Ebrado.JPG",
    motto: "It is what it is. WHAT CAN YOU DO",
  },
  {
    name: "EVANGELISTA, JHON MATTHEW E.",
    imageUrl: "/toga/Evangelista.JPG",
    motto: "Time to rotate — from classrooms to careers. GGs, Class of 2025!",
    itPassport: true,
  },
  {
    name: "GARCIA, JELLO MARI C.",
    imageUrl: "/toga/Garcia.JPG",
    motto: "Think outside the box",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "GUBE, DON DANIELL C.",
    imageUrl: "/toga/Gube.JPG",
    motto: "Leave a little sparkle wherever you go",
    itPassport: true,
  },
  {
    name: "HERNANDEZ, MARC ANDREI L.",
    imageUrl: "/toga/Hernandez M.JPG",
    motto: "Knowledge is power",
    itPassport: true,
  },
  {
    name: "HERNANDEZ, MARK JELO M.",
    imageUrl: "/toga/Hernandez J.JPG",
    motto: "BAHALA NA SI BATMAN",
  },
  {
    name: "ILAO, JHON KYLE P.",
    imageUrl: "/toga/Ilao.JPG",
    motto: "Overthinking it so you will too...",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "KATIMBANG, CYRIL TIFFANY O.",
    imageUrl: "/toga/Katimbang.JPG",
    motto: "I can do all things through Christ who strengthens me.",
  },
  {
    name: "LATADE, PATRICK JACOB H.",
    imageUrl: "/toga/Latade.JPG",
    motto: "Code. Run. Error. Repeat",
    itPassport: true,
  },
  {
    name: "LOZARES, MAUREEN V.",
    imageUrl: "/toga/Lozares.JPG",
    motto: "Who did? God did! I made it!",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "MAMIIT, JOHN VICTOR",
    imageUrl: "/toga/Mamiit.JPG",
    motto: "Be the light in someone's darkness",
  },
  {
    name: "MANIGBAS, QUEENIE ANGELOU V.",
    imageUrl: "/toga/Manigbas.JPG",
    motto: "Dream it, believe it, achieve it",
  },
  {
    name: "MAULEON, ARABELLA LOIS P.",
    imageUrl: "/toga/Mauleon.JPG",
    motto: "i've learned a lot, but i forgot",
  },
  {
    name: "MAYO, JOHN LORENZ Q.",
    imageUrl: "/toga/Mayo.JPG",
    motto: "We are what we overcome.",
  },
  {
    name: "MEDRANO, IVAN D.",
    imageUrl: "/toga/Medrano.JPG",
    motto: "until effort meets opportunity",
  },
  {
    name: "MENDOZA, HARVEY L.",
    imageUrl: "/toga/Mendoza.JPG",
    motto: "Win or Learn , Never Lose",
  },
  {
    name: "MINDANAO, ERICKA MAE C.",
    imageUrl: "/toga/Mindanao.JPG",
    motto: "Code complete. Life loading…",
  },
  {
    name: "MONTEALTO, JUAN MIGUEL M.",
    imageUrl: "/toga/Montealto.JPG",
    motto: "Dum spiro, spero",
  },
  {
    name: "PLOPENIO, EDBERT P.",
    imageUrl: "/toga/Plopenio.JPG",
    motto: "May the source be with you.",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
  {
    name: "PUNZALAN, JHONATHAN T.",
    imageUrl: "/toga/Punzalan.JPG",
    motto: "Adventure is out there",
  },
  {
    name: "REYES, MARIA BETTY R.",
    imageUrl: "/toga/Reyes.JPG",
    motto: "still debugging life.",
  },
  {
    name: "SANZ, ALECKXANDER M.",
    imageUrl: "/toga/Sanz.JPG",
    motto: "Proof that Googling everything can get you a degree.",
  },
  {
    name: "SILANG, L-SON F.",
    imageUrl: "/toga/Silang.JPG",
    motto: "SI LSON NA CLINGY KASURA?",
  },
  {
    name: "SUAREZ, IRISH LEAN C.",
    imageUrl: "/toga/Suarez.JPG",
    motto: "Courage is not the absence of fear",
  },
  {
    name: "TAPALLA, CYRUS E.",
    imageUrl: "/toga/Tapalla.JPG",
    motto: "Peace Out",
    itPassport: true,
  },
  {
    name: "VALENCIA, DEXTER JAMES",
    imageUrl: "/toga/Valencia.JPG",
    motto: "Ctrl + Alt + Dasal",
  },
  {
    name: "VILLANUEVA, CARLA ELIZA M.",
    imageUrl: "/toga/Villanueva.JPG",
    motto: "Optimism is the faith that leads to achievement",
    latinHonor: "Cum Laude",
    itPassport: true,
  },
];

// --- COMPONENTS ---
const StudentProfile: FC<StudentProfileProps> = ({
  name,
  imageUrl,
  motto,
  latinHonor,
  itPassport,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-start text-center h-full">
      <div
        className="relative w-full h-56 bg-white rounded-lg transition-all duration-300 hover:scale-105 overflow-hidden group mb-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={
            imageError
              ? "https://placehold.co/120x128/e2e8f0/4a5568?text=Photo"
              : imageUrl
          }
          alt={name}
          fill
          className={`object-contain object-center transition-all duration-300 ${
            isHovered ? "blur-sm" : ""
          }`}
          onError={() => setImageError(true)}
          unoptimized={imageUrl.includes("placehold.co") || imageError}
        />

        {/* Motto overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-white text-sm font-semibold text-center leading-tight drop-shadow-lg bg-[#8B4513]/90 bg-opacity-70 p-2 rounded">
            "{motto}"
          </p>
        </div>
      </div>

      {/* Fixed name and achievements container with consistent height */}
      <div className="h-20 flex flex-col items-center justify-center w-full px-1">
        <p className="text-sm font-semibold text-gray-700 leading-tight text-center mb-1">
          {name}
        </p>
        <div className="flex flex-col items-center space-y-1 mt-0.2">
          {latinHonor && (
            <p className="text-[0.7rem] italic font-semibold text-[#653C12] leading-tight mb-1">
              {latinHonor}
            </p>
          )}
          {itPassport && (
            <p className="text-[0.65rem] italic font-semibold text-[#653C12] leading-tight">
              IT Passport Passer
            </p>
          )}
      </div>
      </div>
    </div>
  );
};

const Page = React.forwardRef<HTMLDivElement, PageProps>(
  ({ children, number }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className="bg-gray-50 border border-gray-300 flex justify-center items-center relative"
        ref={ref}
      >
        <div className="w-full h-full p-6">
          {children}
          <div className="absolute bottom-3 right-4 text-xs text-gray-400">
            {number}
          </div>
        </div>
      </div>
    );
  }
);
Page.displayName = "Page";

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
    <div
      id="yearbook"
      className="bg-[radial-gradient(ellipse_at_top_center,_#d27532,_#8b4513)] min-h-screen w-full flex flex-col justify-center items-center p-4 font-sans"
    >
      <div className="text-center pt-20">
        <h1
          className="text-5xl font-bold text-[#FFF8E7] tracking-wider"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          The 02 Archives
        </h1>

        {/* Short horizontal line */}
        <hr className="w-16 border-t-2 border-[#F8B259] mx-auto my-4" />

        {/* Subtitle */}
        <h2 className="text-center text-[1.2rem] text-[#FAF3E0] italic mb-12 max-w-[600px] mx-auto py-5">
          Like a system upgraded over time, our bond has evolved—tested by bugs,
          refined by memories, and now ready to run in the real world.
        </h2>
      </div>

      <div className="w-full max-w-4xl scale-95 lg:scale-100">
        {isClient ? (
          <HTMLFlipBook
            width={500}
            height={700}
            size="stretch"
            minWidth={200}
            maxWidth={650}
            minHeight={400}
            maxHeight={900}
            maxShadowOpacity={0.8}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            ref={bookRef}
            className="mx-auto scale-90 lg:scale-100"
          >
            {/* Cover Page */}
            <Page number={0}>
              <div className="flex flex-col items-center justify-center h-full bg-red-800 text-white">
                <div className="w-full max-w-md">
                  <Image
                    src="/images/classpic.webp"
                    alt="School Logo"
                    width={300} // Add appropriate width
                    height={200} // Add appropriate height
                    className="w-full h-auto mb-4"
                    priority // Optional: if this is above the fold
                  />
                </div>
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Class of 2025
                </h2>
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
                <h2
                  className="text-4xl font-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  The End
                </h2>
                <p className="text-lg opacity-90">Thank you for the memories</p>
                <p className="text-sm opacity-75 mt-4">Class of 2025</p>
              </div>
            </Page>
          </HTMLFlipBook>
        ) : (
          // Loading placeholder that matches the expected dimensions
          <div
            className="mx-auto rounded-lg bg-gray-800 flex items-center justify-center"
            style={{ width: 500, height: 700 }}
          >
            <div className="text-white text-lg">Loading yearbook...</div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center space-x-6 pb-5">
        {/* Left Button */}
        <button
          onClick={goToPrevPage}
          className="transition-all disabled:opacity-50 hover:scale-100"
          disabled={currentPage === 0 || !isClient}
        >
          <img
            src="/images/arrow.png" // adjust path to match your public folder
            alt="Previous"
            className="w-10 h-10 rotate-[-135deg]"
          />
        </button>

        {/* Page Count */}
        <div className="text-[#FAF3E0] text-lg font-medium">
          Page {currentPage} of {totalPages}
        </div>

        {/* Right Button */}
        <button
          onClick={goToNextPage}
          className="transition-all disabled:opacity-50 hover:scale-105"
        >
          <img
            src="/images/arrow.png"
            alt="Next"
            className="w-10 h-10 rotate-[45deg]"
          />
        </button>
      </div>
    </div>
  );
};

export default Yearbook;
