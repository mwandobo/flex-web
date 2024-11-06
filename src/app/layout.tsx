
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import ClientProviders from "./client-provider";
import { useSession } from 'next-auth/react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import HydrationZustand from "./Hydrated";
import { GlobalContextProvider } from "@/context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management System",
  description: "The Software System to Manage Projects",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico" }, // Standard favicon
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
      {/*<div className="flex h-screen w-full bg-gray-100">*/}
        <div className="flex w-full bg-gray-200">
        <HydrationZustand>
          <GlobalContextProvider>
            <div className={'flex flex-col w-full'}>
              <Header/>
              <div className="flex w-full gap-4 mt-6 ">
                < Sidebar/>
                <div className="flex flex-col w-full bg-white mb-2 me-4">
                  <div className="p-4 ">
                    {children}
                  </div>
                </div>
              </div>
              <Footer/>
            </div>
          </GlobalContextProvider>
        </HydrationZustand>
        </div>
        {/* </div> */}
      </body>
    </html >

  );



  return <p>Authenticated</p>

}




