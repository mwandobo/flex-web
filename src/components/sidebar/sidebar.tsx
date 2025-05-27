"use client"

import {
    Activity,
    Armchair,
    Book,
    FolderKanban,
    FolderOpenDot,
    HardDrive,
    LayoutDashboard,
    LucideIcon,
    NotebookPen,
    RollerCoaster,
    Settings,
    Table,
    User,
    Users,
    UserCheck,
    Calculator,
    FileIcon,
    FileSliders,
    FileSpreadsheet,
    FilePenLine,
    FileDiff,
    FileBox,
    FileClock,
    ReceiptPoundSterling,
    ShoppingCart,
    BadgeDollarSign,
    SquareDashedKanban,
    Store,
    BookKey,
    ShieldEllipsis,
    CalendarDays, Calendar, Proportions, BookOpenCheck
} from 'lucide-react'
import React from 'react'
import SidebarItem from './item'
import {checkPermissions} from '@/utils/actions/check-permissions'
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

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
        icon: FolderOpenDot,
        permission: 'project_management-list',
        items: [
            {
                name: 'Projects',
                path: '/project-management/project-registration',
                permission: 'projects-list',
                icon: FileIcon
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
                icon: Calculator
            },
            {
                name: 'Indicators Management',
                path: '/indicator-management',
                permission: 'data-list',
                icon: HardDrive
            },
            {
                name: 'Timesheet Management',
                path: '/project-management/timesheet-management',
                permission: 'timesheet-list',
                icon: CalendarDays
            },
            {
                name: 'Lessons Learned',
                path: '/project-management/lessons',
                permission: 'lesson-list',
                icon: BookOpenCheck
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
                icon: FileSliders

            },
            {
                name: 'Learning Reports',
                path: '/report/learning-report',
                permission: 'projects-list',
                icon: FileClock
            },
            {
                name: 'Gantt Chart',
                path: '/report/gantt-chart',
                permission: 'projects-list',
                icon: FileSpreadsheet
            },
            {
                name: 'Project Charter',
                path: '/report/project-charter',
                permission: 'projects-list',
                icon: FilePenLine
            },
            {
                name: 'ME Plan',
                path: '/report/me-plan',
                permission: 'projects-list',
                icon: FileBox
            },
            {
                name: 'Project Report',
                path: '/report/project-report',
                permission: 'projects-list',
                icon: Proportions
            },
            {
                name: 'Profit/Loss Report',
                path: '/report/profit-loss-report',
                permission: 'projects-list',
                icon: Proportions
            },
            {
                name: 'Lessons Learned Report',
                path: '/report/lessons-learned',
                permission: 'projects-list',
                icon: Proportions
            },
            {
                name: 'Procurement Reports',
                path: '/report/procurement-report',
                permission: 'projects-list',
                icon: FileDiff
            },
            {
                name: 'Workshop Reports',
                path: '/report/workshop-report',
                permission: 'projects-list',
                icon: FileDiff
            },
            {
                name: 'Timesheet Reports',
                path: '/report/timesheet',
                permission: 'projects-list',
                icon: Calendar
            },
            {
                name: 'Notification Reports',
                path: '/report/notification-report',
                permission: 'projects-list',
                icon: Calendar
            },
        ]
    },
    {
        name: 'Procurement',
        path: '/procurement',
        permission: 'procurement-list',
        icon: Book,
        items: [
            {
                name: 'Finance',
                path: '/finance',
                permission: 'finance-list',
                icon: ReceiptPoundSterling ,
            },
            {
                name: 'Purchase',
                path: '/procurement',
                permission: 'purchase-list',
                icon: ShoppingCart ,
            },
            {
                name: 'Sales',
                path: '/sales',
                permission: 'sales-list',
                icon: BadgeDollarSign ,
            },
        ]
    },
    {
        name: 'Management',
        path: '/procurement',
        permission: 'procurement-list',
        icon: SquareDashedKanban ,
        items: [
            {
                name: 'Inventory',
                path: '/inventory',
                permission: 'inventory-list',
                icon: Store,
            },
            {
                name: 'Workshop',
                path: '/workshop',
                permission: 'workshop-list',
                icon: BookKey,
            },
        ]
    },

    {
        name: 'Administration',
        path: '/administration',
        permission: 'administration-list',
        icon: ShieldEllipsis ,
        items: [
            {
                name: 'Departments',
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
                icon: Users,
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
        icon: Settings ,
    },
]

function Sidebar() {
    const {state} = useGlobalContextHook()
    const { isSideBarHidden} = state;

    return (
            <div className={`${isSideBarHidden ? 'hidden': 'block'} md:flex w-full md:w-1/4 md:border-e border-gray-200 h-[86vh]`}>
            <div className='h-full w-full'>
                <div className='bg-white px-2 h-full w-full'>
                    <hr className='bg-gray-200'/>
                    <div className="flex-col h-full w-full pt-10 pb-4 pe-4 overflow-auto scrollbar-thin">
                        {
                            items.map(item =>
                                    checkPermissions(item?.permission) && (
                                        <SidebarItem key={item.path} item={item}/>
                                    )
                            )
                        }
                    </div>
                 </div>
            </div>
        </div>
    )
}

export default Sidebar