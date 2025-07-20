import Image from "next/image";
import Yearbook from "@/components/yearbook/Yearbook";
import Messages from "@/components/messages/Messages";
import Videobanner from "@/components/videobanner/Videobanner";
import CreditFooter from "@/components/creditFooter/CreditFooter";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center bg-[#02000D] text-white overflow-hidden">
      
      <Videobanner />
      <Messages />
      <Yearbook />
      <CreditFooter />
    </div>
  );
}
