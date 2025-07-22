import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import localFont from "next/font/local";


const EasyChalk = localFont({
  src: '../../public/fonts/EasterChalk.ttf', // Adjust path as needed
  variable: '--easy-chalk-font',
  display: 'swap',
});

const ChalkStick = localFont({
  src: '../../public/fonts/ChalkStick.ttf', // Adjust path as needed
  variable: '--chalk-stick-font',
  display: 'swap',
});

const CreamyChalk = localFont({
  src: '../../public/fonts/CreamyChalk.ttf', // Adjust path as needed
  variable: '--creamy-chalk-font',
  display: 'swap',
})

const BetterSweet = localFont({
  src: '../../public/fonts/BetterSweet.ttf', // Adjust path as needed
  variable: '--better-sweet-font',
  display: 'swap',
})

const BrightChalk = localFont({
  src: '../../public/fonts/BrightChalk.ttf', // Adjust path as needed
  variable: '--bright-chalk-font',
  display: 'swap',
})

const ChalkClouds = localFont({
  src: '../../public/fonts/ChalkClouds.ttf', // Adjust path as needed
  variable: '--chalk-clouds-font',
  display: 'swap',
})

const CuteChalk = localFont({
  src: '../../public/fonts/CuteChalk.ttf', // Adjust path as needed
  variable: '--cute-chalk-font',
  display: 'swap',
})

const EraserDust = localFont({
  src: '../../public/fonts/EraserDust.ttf', // Adjust path as needed
  variable: '--eraser-dust-font',
  display: 'swap',
})




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAcked Up: The 02 Files",
  description: "BSIT-BA 02",
  icons: {
    icon: "/favicon.ico", 
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
        antialiased ${EasyChalk.variable} ${ChalkStick.variable} ${CreamyChalk.variable} ${BetterSweet.variable} ${BrightChalk.variable}
        ${ChalkClouds.variable} ${CuteChalk.variable} ${EraserDust.variable}`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
