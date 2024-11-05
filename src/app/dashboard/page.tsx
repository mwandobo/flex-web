"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React from 'react'
import BarChartComponent from "@/components/graphs/bar-chart";
import AreaChartComponent from "@/components/graphs/area-chart";
import MultiColorCircularProgress from "@/components/graphs/multi-color-circular-chart";

function Dashboard() {
    const items = [
        {name: "Total Projects", quantity: 12},
        {name: "Pending Projects", quantity: 4},
        {name: "Ongoing Projects", quantity: 3},
        {name: "Completed Projects", quantity: 5},
    ]

    const salesStats = [
        {name: "Current Year Sales", quantity: 123000},
        {name: "Budget Sales", quantity: 12200},
        {name: "Budget Variance (%)", quantity: '36%'},
        {name: "Past Year Sales", quantity: 294294},
        {name: "Sales Growth (%)", quantity: '54%'},
    ]

    const tasks = [
        {name: "Do Something", status: 'pending'},
        {name: "Do Something", status: 'pending'},
        {name: "Do Something", status: 'pending'},
        {name: "Do Something", status: 'pending'},
    ]
    const years = [2020, 2021, 2022, 2023, 2024]
    return (
        <ProtectedRoute>
            <div className='flex flex-col '>
                <div className='flex gap-2'>
                    <div className={'w-3/4'}>
                        <div className={'grid grid-cols-4 gap-2 '}>
                            {items.map((item, index) => (
                                <div key={index}
                                     className={'bg-white h-40 flex flex-col justify-center items-center shadow-md rounded-md'}>
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className={'mt-2 bg-white shadow-md rounded-md p-2'}>
                            <div className={'mb-2'}>
                                <h3>Project Expenses </h3>
                            </div>
                            <BarChartComponent/>
                        </div>
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


                <div className={'flex bg-white flex-col mt-2 p-2'}>
                    <h3 className={'mb-2'}>Sales Dashboard</h3>
                    <div className={'bg-white p-2'}>
                        <div className={'grid grid-cols-5 gap-2 '}>
                            {salesStats.map((item, index) => (
                                <div key={index}
                                     className={'bg-white h-40 flex flex-col justify-center items-center shadow-md rounded-md'}>
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'flex mt-2 gap-2'}>

                        <div className={'bg-white shadow-md rounded-md p-2'}>
                            <h3 className={'mb-2'}>Project Expenses </h3>
                            <AreaChartComponent/>
                        </div>
                        <div className={'w-3/4'}>
                            <h3 className={'mb-2'}>Project Expenses </h3>
                            <BarChartComponent/>
                        </div>

                        <div className={'flex flex-col bg-white shadow-md rounded-md '}>
                            <div className={'mb-2'}>
                                <h3 className={'mb-2'}>Years </h3>
                                {
                                    years.map(item => (
                                            <button
                                                key={item}
                                                className={'border border-gray-200'}
                                            >{item}</button>
                                        )
                                    )}

                            </div>
                            <div className={'mb-2'}>
                                <MultiColorCircularProgress percentage={75}/>
                                <p>Legend:</p>
                                <ul>
                                    <li><span style={{color: "#4CAF50"}}>•</span> Segment 1 - 25%</li>
                                    <li><span style={{color: "#FFA500"}}>•</span> Segment 2 - 35%</li>
                                    <li><span style={{color: "#FF6347"}}>•</span> Segment 3 - 20%</li>
                                    <li><span style={{color: "#1E90FF"}}>•</span> Segment 4 - 20%</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </ProtectedRoute>
    )
}

export default Dashboard