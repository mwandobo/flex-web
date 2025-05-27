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
                <div className={'flex flex-col justify-between h-full ps-8 pt-8 pb-8'}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="h-16 w-16 object-contain"
                    />
                    <div className={'flex w-full justify-center'}>
                        <div className=" w-full" >
                            {loading ? (
                                <div className='w-3/4'>
                                    <Loading/>
                                </div>
                            ) : (
                                <div className='p-5 w-full ps-80 pe-8'>
                                    <div className='w-full flex flex-col items-center gap-8'>
                                        <h4 className={'text-4xl text-gray-700 font-semibold '}>{title ?? subtitle}</h4>
                                        <h4 className={'text-sm font-semibold text-gray-400'}>{subtitle}</h4>
                                        <div className={'w-full mt-8'}>
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="flex items-center justify-start text-sm text-gray-500">
                        Copyright  &copy; {new Date().getFullYear()} Flex. All rights reserved.
                    </p>
                </div>
                <div className={'px-16 py-2'}>
                    <div className={'h-full bg-gray-200 flex flex-col gap-8 justify-center px-16 rounded-2xl '}>
                        <h4 className={'text-start w-full text-4xl'}>
                            Effortlessly manage your team and operations.
                        </h4>
                        <p className={'text-start w-full'}>Log in to access your CRM dashboard and manage your
                            projects.
                        </p>

                        <div className={'flex'}>
                            <div className={'rounded-md p-2 bg-white'}>
                                <img
                                    src="/login_background_1.png"
                                    alt="Logo"
                                    className=" object-contain"
                                />
                            </div>

                            <div
                                className={'z-10 -ms-28 mt-[68px] border shadow-md border-gray-200 h-fit rounded-md p-1 bg-white'}>
                                <img
                                    src="/login_sub_background_3.png"
                                    alt="Logo"
                                    className=" object-contain"
                                />
                            </div>

                            {/*<img className='h-full' width={'90%'} src="/login_background.jpeg"/>*/}
                        </div>
                    </div>


                </div>
            </div>

        </div>
    )
}

export default AuthSkeletonComponent;
