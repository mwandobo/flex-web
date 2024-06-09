"use client"

import { ChevronDown, LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import SubMenuItem from './submenu-item'
import { setValueLocalStorage } from '@/utils/actions/local-starage'
import { checkPermissions } from '@/utils/actions/check-permissions'

interface ISidebarItem {
    name: string
    path: string
    icon: LucideIcon
    items?: ISubItem[]
    group?: string
    permission?: string
}

interface ISubItem {
    name: string
    path: string
    icon: LucideIcon
    group?: string
    permission?: string
}

function SidebarItem({ item }: { item: ISidebarItem }) {
    const { name, icon: Icon, items, path, group } = item
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()
    const pathName = usePathname()

    const onclick = () => {
        if (items && items.length > 0) {
            setExpanded(!expanded)
        }
        else {
            router.push(path)
        }
    }

    const isActive = useMemo(() => {

        if (items && items.length > 0) {
            if (items.find(item => item.path === pathName)) {
                setExpanded(true);
                return true;
            }
        }

        return path === pathName
    }, [path, pathName, items])


    return (
        <>
            <div className={`flex items-center justify-between p-2 hover:bg-sidebar-background hover:text-sidebar-active rounded-lg cursor-pointer text-sidebar-iconColor ${isActive && "text-indigo-700 bg-sidebar-background"}`}
                onClick={onclick}
            >
                <div className='flex items-center space-x-2'>
                    <Icon size={13} />
                    <p className="text-sm font-semibold"> {name} </p>
                </div>
                {items && items.length > 0 && <ChevronDown size={18} className={expanded ? 'rotate-180 duration-200' : ''} />}

            </div>
            {expanded && items && items.length &&
                <div className="flex flex-col space-x-1 ml-10">
                    {items.map(item =>
                        checkPermissions(item?.permission) && <> <SubMenuItem key={item.path} item={item} /></>
                    )}
                </div>
            }
        </>
    )
}

export default SidebarItem