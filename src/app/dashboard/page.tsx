"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React from 'react'
import LeadsChart from "@/app/project-management/project-monitoring/comps/buget";

function Dashboard() {
    const items = [
        {name: "Total Projects", quantity:12},
        {name: "Pending Projects", quantity:4},
        {name: "Ongoing Projects", quantity:3},
        {name: "Completed Projects", quantity:5},
    ]

    const tasks = [
        {name: "Do Something", status:'pending'},
        {name: "Do Something", status:'pending'},
        {name: "Do Something", status:'pending'},
        {name: "Do Something", status:'pending'},

    ]
    return (
        <ProtectedRoute>
            <div className='flex gap-2'>
                <div className={'w-3/4'}>
                    <div className={'grid grid-cols-4 gap-2 '}>
                        {items.map((item, index) => (
                            <div key={index} className={'bg-white h-40 flex flex-col justify-center items-center shadow-md rounded-md'}>
                                <p>{item.name}</p>
                                <p>{item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    {/*<div className={'mt-2'}>*/}
                    {/*    <LeadsChart/>*/}
                    {/*</div>*/}
                </div>
                <div className={'w-1/4 bg-white p-2'}>
                    <div className={'flex flex-col'}>
                        <h3>Assigned Tasks</h3>
                        {tasks.map((task, index) => (
                            <div key={index} className={'flex text-sm justify-between'}>
                                <p>{task.name}</p>
                                <p className={'me-20'}>{task.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default Dashboard