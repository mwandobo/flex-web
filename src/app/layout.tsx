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
import SlideOverRender from "@/components/slide-over/slide-over-render.component";

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
                        <div className={'flex'}>
                            <Sidebar/>
                            <div className={'flex w-full flex-col'}>
                                <Header/>

                                <div className="bg-gray-200 pt-6 px-4 ">
                                    <div className="bg-white p-3 h-[82vh] overflow-auto rounded-md">
                                        {children}
                                    </div>
                                </div>


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
                            <SlideOverRender/>
                            <ToastContainer position="top-right" autoClose={5000}/>
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
