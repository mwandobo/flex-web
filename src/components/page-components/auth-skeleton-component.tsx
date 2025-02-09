"use client"

import React from 'react'
import Loading from "@/components/status/loading.component";

type Props = {
    children: React.ReactNode;
    loading?: boolean
    subtitle?: string
};

function AuthSkeletonComponent({children, loading, subtitle}: Props) {
    return (

        <div className='w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-gradient-to-r from-slate-300 to-slate-500 z-50'>
            <div
                className=" border border-gray-300 bg-white shadow-2xl rounded-xl w-96"
            >
                {loading ? (
                    <div className='w-3/4'>
                        <Loading />
                    </div>
                ) : (
                    <div className='p-5'>
                        <div className="flex flex-col p-[15%] justify-center items-center w-full">
                            <img className='h-full' width={'40%'} src="/logo.png" />
                            <h4 className={'mt-2 text-xs text-gray-700'}>{subtitle}</h4>
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
