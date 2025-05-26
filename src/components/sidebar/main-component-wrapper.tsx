"use client"

import React from 'react'
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

interface Props {
    children: React.ReactNode
}

function MainComponentWrapper({children}: Props) {
    const {state} = useGlobalContextHook()
    const { isSideBarHidden} = state;

    return (
        <div className={`${isSideBarHidden ? 'block' : 'hidden'}  md:flex  w-full flex-col`}>
            <div className="bg-gray-200 pt-6 px-4 md:w-[75vw] lg:w-full ">
                <div className="bg-white p-3 w-full h-[82vh] overflow-auto rounded-md">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainComponentWrapper