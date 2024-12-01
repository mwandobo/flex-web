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

            if(path=== '/project-management/project-planning'){
                setValueLocalStorage('selected_plan_item', 'goal' )
                setValueLocalStorage('selected_plan_item_id', null )
            }
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
        <div className={'text-gray-700 font-medium'} style={{fontSize:'13px'}}>
            {/*<div className={`flex items-center justify-between p-2 hover:bg-sidebar-background hover:text-sidebar-active rounded-lg cursor-pointer text-sidebar-iconColor ${isActive && "text-indigo-700 bg-sidebar-background"}`}*/}
            <div className={`flex items-center mb-1 justify-between p-2 rounded cursor-pointer hover:bg-gray-200 ${isActive && "bg-gray-200"}`}
                onClick={onclick}
            >
                <div className='flex items-center gap-1'>
                    <Icon size={13} />
                    <p className=""> {name} </p>
                </div>
                {items && items.length > 0 && <ChevronDown size={14} className={expanded ? 'rotate-180 duration-200' : ''} />}

            </div>
            {expanded && items && items.length &&
                <div className="flex flex-col ml-8">
                    {items.map(item =>
                        checkPermissions(item?.permission) && <> <SubMenuItem key={item.path} item={item} /></>
                    )}
                </div>
            }
        </div>
    )
}

export default SidebarItem