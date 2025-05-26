"use client"

import { setValueLocalStorage } from '@/utils/actions/local-starage'
import { ChevronDown, LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

interface ISubItem {
    name: string
    path: string
    icon: LucideIcon
    group?: string
}

function SubMenuItem({ item }: { item: ISubItem }) {
    const { name, icon: Icon, path, group } = item
    const router = useRouter()
    const pathName = usePathname()
    const { dispatch} = useGlobalContextHook()

    const onclick = () => {
        router.push(path)
        if (group && path !== pathName) {
            setValueLocalStorage('group', group);
        }
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            dispatch({ type: "UPDATE_HIDE_SIDEBAR", payload: true })
        }
    }

    const isActive = useMemo(() => {
        return path === pathName
    }, [path, pathName])

    return (
        <>
            {/*<div className={`flex items-center justify-between mt-1 p-2 hover:bg-sidebar-background hover:text-sidebar-active rounded-lg cursor-pointer text-sidebar-iconColor ${isActive && "text-indigo-700 bg-sidebar-background"}`}*/}
            <div className={`flex items-center justify-between py-1 ps-2 rounded cursor-pointer mb-1 hover:bg-gray-200 ${isActive && "bg-gray-200 "}`}
                onClick={onclick}
            >
                <div className='flex items-center space-x-2'>
                    <Icon size={13}/>
                    <p className=""> {name} </p>
                    {/*<p className="hidden md:block"> {name} </p>*/}
                </div>
            </div>

        </>

    )
}

export default SubMenuItem