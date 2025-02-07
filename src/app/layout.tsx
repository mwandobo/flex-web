import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HydrationZustand from "./Hydrated";
import {GlobalContextProvider} from "@/context/GlobalContext";
import WebSocketComponent from "@/components/web-socket.component";
import {ToastContainer} from "react-toastify";

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
        <body className={`${inter.className}`}>
        <div className="flex h-[100vh] w-full bg-gray-200 ">
            <HydrationZustand>
                <GlobalContextProvider>
                    <div className={'w-full h-full flex'}>
                        <Sidebar/>
                        <div className={'w-full'}>
                            <Header/>
                            {/*    /!*body*!/*/}
                            {/*    <div className="flex w-full h-full">*/}
                            {/*        < Sidebar/>*/}
                            {/*        <div className={'w-full h-full'}>*/}
                            {/*            <div className="flex flex-col w-full h-full justify-between ">*/}
                            {/*                <div className={'px-4 pt-4 pb-1 w-full h-full'}>*/}
                            {/*                    <div className="bg-white p-6">*/}
                            {/*                        {children}*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*                <Footer/>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                        </div>
                        <WebSocketComponent/>
                        <ToastContainer position="top-right" autoClose={5000}/>
                    </div>
                </GlobalContextProvider>
            </HydrationZustand>
        </div>
        {/* </div> */}
        </body>
        </html>
    );
}
