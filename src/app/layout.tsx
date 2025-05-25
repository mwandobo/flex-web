import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HydrationZustand from "./Hydrated";
import {GlobalContextProvider} from "@/context/GlobalContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Project Management System",
    description: "The Software System to Manage Projects",
    icons: {
        icon: [
            {rel: "icon", url: "/favicon.ico"}, // Standard favicon
            {rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png"},
            {rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png"},
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
        <body className={`${inter.className} `}>
        <div className="bg-gray-200 ">
            <HydrationZustand>
                <GlobalContextProvider>
                    <div className={'flex flex-col'}>
                        <div className={'flex w-full flex-col'}>
                            <Header/>
                            <div className={'flex'}>
                                <Sidebar/>
                                {/* Main content area */}
                                <div className={'flex w-full flex-col'}>
                                    <div className="bg-gray-200 pt-6 px-4 ">
                                        <div className="bg-white p-3 h-[82vh] overflow-auto rounded-md">
                                            {children}
                                        </div>
                                    </div>
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
        </html>
    );
}
