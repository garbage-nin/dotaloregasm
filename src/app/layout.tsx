import type { Metadata } from "next";
import { Cinzel_Decorative, Rajdhani } from "next/font/google";
import Header from "./component/Header";
import Footer from "./component/Footer";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./component/Loading";
import { UserProvider } from "@/context/user-context";

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Dotaloregasm",
  description: "Your daily Dota 2 lore challenge!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${rajdhani.variable}`}>
      <UserProvider>
        <body className="font-rajdhani antialiased">
          <div className="flex flex-col min-h-screen relative">
            <Header />
            <main className="flex-1 container mx-auto p-4 relative z-10">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
            <Footer />
          </div>
        </body>
      </UserProvider>
    </html>
  );
}
