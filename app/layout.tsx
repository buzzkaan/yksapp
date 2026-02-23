import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
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

export const metadata: Metadata = {
  title: "⚔️ YKS Quest",
  description: "Pokémon esintili YKS çalışma RPG uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="tr">
        <body className={`${pixelFont.variable} ${bodyFont.variable}`}>
          <Navbar />
          <main
            className="min-h-screen pb-20 lg:pb-6 lg:ml-64"
            style={{ background: "#E8E0D0" }}
          >
            {children}
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#181828",
                color: "#F8D030",
                border: "4px solid #4088F0",
                borderRadius: "0",
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "20px",
                boxShadow: "4px 4px 0px 0px #101010",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
