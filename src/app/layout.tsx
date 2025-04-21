import type { Metadata } from "next";
import Header from "./component/Header";
import Footer from "./component/Footer";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./component/Loading";
import { UserProvider } from "@/context/user-context";
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
    <html lang="en">
      <UserProvider>
        <body>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto p-4">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
            <Footer />
          </div>
        </body>
      </UserProvider>
    </html>
  );
}
