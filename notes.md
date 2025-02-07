remove comment in the sidebar for logo
in the layout change color from yellow to gray
in the side bar change color from yellow to white.
in the headers change color from yellow to white.
after change password check the redirect page.

when fetch approval update state.

after change password redirect.
check if it needs approve in the index page.
if itNeeds approve fetch approvedItems on that page refresh
####CASEREQUISITIONREQUEST
i have to create a condition in the crud form which will also allow to pass form instead of form inputs
I handle form state isolated store in local storage and the pull while submitting

i have to contorl modal body ealy before i get deep

Card still clickable when i created purchase request

PROCESS FOR APPROVAL.

In the index page add approval slug .
in view page you have to use the following hook

/**
const {
isNeedApprove,
isLastLevel,
latestApproveStatus,
approvalButtonsWrapper,
} = useApprovalHook({
approval_slug: PROJECT_APPROVAL_SLUG,
from: 'project',
from_id: id
})
**/


Handle render when error



&& progressRender(item.progress) !== "No Indicator" 


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
        <div className="flex w-full bg-gray-200 ">
            <HydrationZustand>
                <GlobalContextProvider>
                    <div className={'flex flex-col w-full min-h-screen'}>
                        <Header/>
                        {/*body*/}
                        <div className="flex w-full h-full">
                            < Sidebar/>
                            <div className={'w-full h-full'}>
                                <div className="flex flex-col w-full h-full justify-between ">
                                    <div className={'px-4 pt-4 pb-1 w-full h-full'}>
                                        <div className="bg-white p-6">
                                            {children}
                                        </div>
                                    </div>
                                    <Footer/>
                                </div>
                            </div>
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
