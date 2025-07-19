import Image from "next/image";
import Yearbook from "@/components/yearbook/Yearbook";
import Videobanner from "@/components/videobanner/Videobanner";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#02000D] text-white overflow-hidden">
      
      <Videobanner />
      <Yearbook />
    </div>
  );
}
