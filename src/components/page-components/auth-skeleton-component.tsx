"use client"

import React from 'react'
import Loading from "@/components/status/loading.component";

type Props = {
    children: React.ReactNode;
    loading?: boolean
    subtitle?: string
    subtitle1?: string
    title?: string
};

function AuthSkeletonComponent({children, loading, subtitle,subtitle1, title}: Props) {
    return (
        <div className='fixed top-0 left-0 w-full h-[100vh] items-center justify-center bg-gray-200 z-50 lg:py-12 lg:px-48'>
            <div className={'bg-gray-200 h-full md:p-4 border border-white shadow-md rounded-2xl'}>
                <div className={'bg-white h-full rounded-2xl'}>
                    <div className={'grid grid-cols-1 lg:grid-cols-2 p-3 h-full rounded-2xl'}>

                        {/*first card*/}
                        <div className={'flex w-full flex-col gap-4 justify-between h-full lg:ps-8 pt-8 pb-8'}>
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-16 w-16 object-contain"
                            />
                            <div className={'flex w-full justify-center'}>
                                <div className=" w-full">
                                    {loading ? (
                                        <div className='w-3/4'>
                                            <Loading/>
                                        </div>
                                    ) : (
                                        <div className='lg:p-5 w-full lg:ps-24 lg:pe-12 mb-36 lg:mb-0'>
                                            <div className='w-full flex flex-col items-center gap-8'>
                                                <h4 className={'text-2xl md:text-4xl  text-gray-500 font-semibold '}>{title ?? subtitle}</h4>
                                                <h4 className={'text-sm font-semibold text-gray-400'}>{subtitle}</h4>
                                                <div className={'w-full '}>
                                                    {children}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="flex  items-center justify-start md:justify-center lg:justify-start text-sm text-gray-500">
                                Copyright  &copy; {new Date().getFullYear()} Flex. All rights reserved.
                            </p>
                        </div>


                        {/*second card*/}

                        <div className={'hidden lg:block py-2'}>
                            <div className={'h-full bg-gray-200 flex flex-col gap-8 justify-center px-16 rounded-2xl '}>
                                <h4 className={'text-start w-full text-3xl text-gray-600 font-semibold'}>Effortlessly manage your team and operations.</h4>
                                <p className={'text-start w-full text-gray-500'}>{subtitle1} </p>
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
            </div>
        </div>
    )
}

export default AuthSkeletonComponent;
