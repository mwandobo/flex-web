"use client"

import { Activity, AlignHorizontalJustifyStart, Armchair, Book, FolderKanban, FolderOpenDot, Gauge, HardDrive, LayoutDashboard, LucideIcon, NotebookPen, RollerCoaster, Scale, Settings, Settings2, Table, User, UserCog, UserRound, UserRoundCog, Users } from 'lucide-react'
import React from 'react'
import SidebarItem from './item'
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

const items: ISidebarItem[] = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard-list'
    },
    {
        name: 'Project Management',
        path: '/projects',
        icon: FolderKanban,
        permission: 'project_management-list',
        items: [
            {
                name: 'Projects',
                path: '/project-management/project-registration',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
            {
                name: 'Project Planning Management',
                path: '/project-management/project-planning',
                permission: 'project_planning-list',
                icon: NotebookPen
            },
            {
                name: 'Project Monitoring',
                path: '/project-management/project-monitoring',
                permission: 'project_monitoring-list',
                icon: Activity
            },
            {
                name: 'Project Evaluation',
                path: '/project-management/project-evaluation',
                permission: 'project_monitoring-list',
                icon: Activity
            },
            {
                name: 'Indicators Management',
                path: '/indicator-management',
                permission: 'data-list',
                icon: HardDrive
            },
        ]
    },
    {
        name: 'Reports',
        path: '/report',
        icon: FolderKanban,
        permission: 'project_management-list',
        items: [
            {
                name: 'Evaluation Reports',
                path: '/report/evaluation-report',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
            {
                name: 'Learning Reports',
                path: '/report/learning-report',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
            {
                name: 'Gantt Chart',
                path: '/report/gantt-chart',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
        ]
    },
    {
        name: 'Admnistration',
        path: '/admnistration',
        permission: 'admnistration-list',
        icon: Book,
        items: [
            {
                name: 'Deparments',
                path: '/admnistration/departments',
                permission: 'departments-list',
                icon: Table
            },
            {
                name: 'Positions',
                path: '/admnistration/positions',
                permission: 'positions-list',
                icon: Armchair
            },
            {
                name: 'Employees',
                path: '/admnistration/employees',
                permission: 'employees-list',
                icon: User
            },
            {
                name: 'Stakeholders',
                path: '/admnistration/external?group=stakeholder',
                permission: 'stakeholders-list',
                icon: Users,
                group: 'stakeholder'
            },
            {
                name: 'Sponsors',
                path: '/admnistration/external?group=sponsor',
                permission: 'sponsors-list',
                icon: Users,
                group: 'sponsor'
            },
            {
                name: 'Representatives',
                path: '/admnistration/external?group=representative',
                permission: 'representatives-list',
                icon: Armchair,
                group: 'representative'
            },
            {
                name: 'Roles',
                path: '/roles',
                permission: 'roles-list',
                icon: RollerCoaster
            },
        ]
    },
    {
        name: 'Settings',
        path: '/settings',
        permission: 'settings-list',
        icon: Settings,
        items: [
            {
                name: 'Stakeholder Types',
                path: '/settings?group=stakeholder',
                permission: 'setting_stakeholder-list',
                icon: UserRoundCog,
                group: 'stakeholder'
            },
            {
                name: 'Sponsor Types',
                path: '/settings?group=sponsor',
                permission: 'setting_sponsor-list',
                icon: UserCog,
                group: 'sponsor'

            },
            {
                name: 'Representative Types',
                path: '/settings?group=representative',
                permission: 'setting_representative-list',
                icon: UserCog,
                group: 'representative'
            },

            {
                name: 'Sponsorship Types',
                path: '/settings?group=sponsorship',
                permission: 'setting_sponsorship-list',
                icon: Settings2,
                group: 'sponsorship'

            },
            {
                name: 'Resources Types',
                path: '/settings?group=resource',
                permission: 'setting_resource-list',
                icon: AlignHorizontalJustifyStart,
                group: 'resource'

            },
            {
                name: 'Project Types',
                path: '/settings?group=project',
                permission: 'setting_project-list',
                icon: Scale,
                group: 'project'

            },
            {
                name: 'Indicator Measurements Types',
                path: '/settings?group=measurement',
                permission: 'setting_measurement-list',
                icon: Scale,
                group: 'measurement'

            },
            {
                name: 'Assignment Types',
                path: '/settings?group=assignment',
                permission: 'setting_assignment-list',
                icon: Scale,
                group: 'assignment'

            },

        ]
    },


]

function Sidebar() {
    return (
        <div className='fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-10 p-4'>
            <div className="flex flex-col space-y-10">
                <img className='h-10 w-fit' src="/logo.png" alt="logo" />
                <div
                    className='flex flex-col space-y-2'
                >
                    {
                        items.map(item =>
                            <>
                                {
                                    checkPermissions(item?.permission) && <> <SidebarItem key={item.path} item={item} /></>
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Sidebar