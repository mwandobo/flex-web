"use client"

import React from 'react'
import Loading from "@/components/status/loading.component";

type Props = {
    children: React.ReactNode;
    loading?: boolean
    subtitle?: string
    title?: string
};

function AuthSkeletonComponent({children, loading, subtitle, title}: Props) {
    return (
        <div className='fixed top-0 left-0 w-full h-[100vh] items-center justify-center bg-white z-50'>
            <div className={'grid grid-cols-2 p-3 h-full'}>
                <div className={'flex flex-col justify-between  h-full ps-8 pt-8 pb-8'}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-16 w-16 object-contain"
                    />
                    <div className={'flex w-full justify-center'}>
                        <div
                            // className=" border border-gray-300 bg-white shadow-2xl rounded-xl w-[60%]"
                            className="  w-[60%]"
                        >
                            {loading ? (
                                <div className='w-3/4'>
                                    <Loading/>
                                </div>
                            ) : (
                                <div className='p-5 w-full'>
                                    <div className="flex flex-col mb-8 justify-center items-center w-full">
                                        <h4 className={'text-4xl text-gray-700 font-semibold mb-6'}>{title ?? subtitle}</h4>
                                        <h4 className={'text-sm font-semibold text-gray-400'}>{subtitle}</h4>
                                    </div>
                                    <>
                                        {children}
                                    </>
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="flex items-center justify-start text-sm text-gray-500">
                        Copyright  &copy; {new Date().getFullYear()} Flex. All rights reserved.
                    </p>

                </div>
                <div className={''}>
                    <div className={'me-48'}>
                        <img
                            src="/login_background.jpeg"
                            alt="Logo"
                            className="h-[97vh] w-[100%] object-contain"
                        />
                        {/*<img className='h-full' width={'90%'} src="/login_background.jpeg"/>*/}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AuthSkeletonComponent;
