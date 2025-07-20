
'use client';
import Yearbook from "@/components/yearbook/Yearbook";
import Messages from "@/components/messages/Messages";
import CreditFooter from "@/components/creditFooter/CreditFooter";
import VideoBanner from "@/components/videobanner/Videobanner";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#02000D] text-white overflow-hidden">
      <div className="w-full">
        <VideoBanner
        videoId="5YNaUd_zc0k" // Replace with your YouTube video ID
        nextSectionId="messages"
        autoPlay={true}
        muted={false}
        loop={false}
        showControls={true}
        overlayContent={
          <div className="text-center">
            <h1 className="font-[CreamyChalk] backdrop-blur-sm text-6xl md:text-8xl lg:text-9xl mb-4 drop-shadow-lg">
              Deploy Version 02
            </h1>
            {/* <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              
            </p> */}
          </div>
        }
      />
      </div>

          <Messages />
      <Yearbook />
      <CreditFooter />        
    </div>
  );
}
