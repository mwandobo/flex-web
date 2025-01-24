"use client"

import {
    Activity,
    Ligature,
    AlignHorizontalJustifyStart,
    Armchair,
    Book,
    FolderKanban,
    FolderOpenDot,
    Gauge,
    HardDrive,
    LayoutDashboard,
    LucideIcon,
    NotebookPen,
    RollerCoaster,
    Scale,
    Settings,
    Settings2,
    Table,
    User,
    UserCog,
    UserRound,
    UserRoundCog,
    Users,
    UserCheck,
    Bell
} from 'lucide-react'
import React from 'react'
import SidebarItem from './item'
import {checkPermissions} from '@/utils/actions/check-permissions'

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
            {
                name: 'Project Charter',
                path: '/report/project-charter',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
            {
                name: 'ME Plan',
                path: '/report/me-plan',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
            {
                name: 'Procurement Reports',
                path: '/report/procurement-report',
                permission: 'projects-list',
                icon: FolderOpenDot
            },
        ]
    },
    {
        name: 'Procurement and Management',
        path: '/procurement',
        permission: 'procurement-list',
        icon: Book,
        items: [
            {
                name: 'Finance',
                path: '/finance',
                permission: 'finance-list',
                icon: Book,
            },
            {
                name: 'Inventory',
                path: '/inventory',
                permission: 'inventory-list',
                icon: Book,
            },
            {
                name: 'Purchase',
                path: '/procurement',
                permission: 'purchase-list',
                icon: Book,
            },
            {
                name: 'Sales',
                path: '/sales',
                permission: 'sales-list',
                icon: Book,
            },
            {
                name: 'Workshop',
                path: '/workshop',
                permission: 'workshop-list',
                icon: Book,
            },
        ]
    },
    {
        name: 'Administration',
        path: '/administration',
        permission: 'administration-list',
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
            {
                name: 'Approvals',
                path: '/admnistration/approvals',
                permission: 'approvals-list',
                icon: UserCheck
            },
        ]
    },

    {
        name: 'Settings',
        path: '/settings',
        permission: 'settings-list',
        icon: Book,
    },
]

function Sidebar() {
    return (
        <div className='w-64 bg-white z-60 p-4 sticky top-16 min-h-full  overflow-y-auto z-10'>
            <div className="flex flex-col  mt-6">
                <div
                    className='flex flex-col'
                >
                    {
                        items.map(item =>
                            <>
                                {
                                    checkPermissions(item?.permission) &&
                                    <SidebarItem key={item.path} item={item}/>
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