"use client"

import React from 'react'
import Loading from "@/components/status/loading.component";

type Props = {
    children: React.ReactNode;
    loading?: boolean
};

function AuthSkeletonComponent({children, loading}: Props) {
    return (
        <div className='w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-gray-300 z-50'>
            <div
                className="w-[96] border border-gray-300 bg-white shadow-2xl rounded-lg"
            >
                {loading ? (
                    <div className='w-3/4'>
                        <Loading />
                    </div>
                ) : (
                    <div className='p-5'>
                        <div className="flex flex-col p-[15%] justify-center items-center w-full">
                            <img className='h-full' width={'40%'} src="/logo.png" />
                        </div>
                        <>
                            {children}
                        </>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthSkeletonComponent;
