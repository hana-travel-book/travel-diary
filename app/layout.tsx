import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { TripProvider } from "./lib/tripContext";
import PasswordGate from "./components/PasswordGate";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TravelDiary — Thailand 2026",
  description: "Every journey becomes a story.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TravelDiary",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};


export const viewport: Viewport = {
  themeColor: "#2B2A28",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant"
      className={`${fraunces.variable} ${jakarta.variable} ${plexMono.variable} antialiased`}
    >
      <body className="bg-[#F7F3EC] font-sans">
        <TripProvider>
          <PasswordGate>{children}</PasswordGate>
        </TripProvider>
      </body>
    </html>
  );
}
