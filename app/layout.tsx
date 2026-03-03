import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323, Nunito } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { PWAInit } from "@/components/PWAInit";
import { DailyLoginBonus } from "@/components/DailyLoginBonus";
import { ICONS } from "@/lib/constants/icons";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-start",
});

const bodyFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const modernFont = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-modern",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000058",
};

export const metadata: Metadata = {
  title: "⚔️ YKS Quest",
  description: "Pokémon esintili YKS çalışma RPG uygulaması",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YKS Quest",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "YKS Quest",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <head>
          <link rel="apple-touch-icon" href={ICONS.flag} />
        </head>
        <body className={`${pixelFont.variable} ${bodyFont.variable} ${modernFont.variable}`}>
          {/* Yazı ayarlarını sayfa yüklenmeden önce uygula (FOUC önleme) */}
          <script dangerouslySetInnerHTML={{ __html: `(function(){try{var b=localStorage.getItem('yaziBoyutu')||'normal';var s=localStorage.getItem('yaziStili')||'pixel';if(b!=='normal')document.documentElement.dataset.boyut=b;if(s!=='pixel')document.documentElement.dataset.stil=s;}catch(e){}})();` }} />
          <PWAInit />
          <DailyLoginBonus />
          <Navbar />
          <main
            className="min-h-screen pb-20 lg:pb-6 lg:ml-64"
          >
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#000058",
                color: "#FFD000",
                border: "4px solid #0058F8",
                borderRadius: "0",
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "20px",
                boxShadow: "4px 4px 0px 0px #000000",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
