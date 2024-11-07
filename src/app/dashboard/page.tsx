"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import BarChartComponent from "@/components/graphs/bar-chart";
import AreaChartComponent from "@/components/graphs/area-chart";
import MultiColorCircularProgress from "@/components/graphs/multi-color-circular-chart";
import {get} from "@/utils/api";
import {useRouter} from "next/navigation";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";

function Dashboard() {
    const [data, setData] = useState<any>(null)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [projectStatsRes, projectExpenseStatsRes, assignedTasksRes, salesPurchaseStats] = await Promise.all([
                    get('dashboard/project-stats', token),
                    get('dashboard/project-expenses-stats', token),
                    get('dashboard/assigned-tasks', token),
                    get('dashboard/sales-purchase-stats', token)
                ]);

                if (projectStatsRes.status === 200 && projectExpenseStatsRes.status === 200 && assignedTasksRes.status === 200 && salesPurchaseStats.status === 200) {
                    setData({
                        ...data,
                        projectStats: projectStatsRes.data.data,
                        projectExpenseStats: projectExpenseStatsRes.data.data,
                        assignedTasks: assignedTasksRes.data.data,
                        salesPurchaseStats: salesPurchaseStats.data.data
                    });
                }
            } catch (error) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin();
                }
            }
        };

        fetchAllData();
    }, []);


    const navigateToLogin = () => {
        return router.push('/login')
    }

    const projectStats= data?.projectStats
    const items = [
        {name: "Total Projects", quantity: projectStats?.all_projects},
        {name: "Pending Projects", quantity: projectStats?.pending_projects},
        {name: "Ongoing Projects", quantity: projectStats?.ongoing_projects},
        {name: "Completed Projects", quantity: projectStats?.completed_projects},
        {name: "Closed Projects", quantity: projectStats?.closed_projects},
    ]

    const salesPurchaseStats = data?.salesPurchaseStats

    const salesStats = [
        {name: "Total Sales", quantity: salesPurchaseStats?.total_sales},
        {name: "Total Purchase", quantity: salesPurchaseStats?.total_purchases},
        {name: "Total IN Payment", quantity: salesPurchaseStats?.total_in_payments},
        {name: "Total OUT Payment", quantity: salesPurchaseStats?.total_out_payments},
        {name: "Total Pending IN Payment", quantity: salesPurchaseStats?.total_pending_in_payments},
        {name: "Total Pending OUT Payment", quantity: salesPurchaseStats?.total_pending_out_payments},
    ]

    const years = [2020, 2021, 2022, 2023, 2024]
    return (
        <ProtectedRoute>
            <div className='flex flex-col text-xs'>
                <div className='flex gap-2'>
                    <div className={'w-2/3'}>
                        <div className={'grid grid-cols-5 gap-2 '}>
                            {items.map((item, index) => (
                                <div key={index}
                                     className={'bg-white h-20 flex flex-col justify-center items-center shadow-md rounded-md border border-gray-200'}>
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        {
                            data?.projectExpenseStats &&
                        <div className={'mt-2 bg-white shadow-md rounded-md p-2 border border-gray-200'}>
                            <div className={'mb-2'}>
                                <h3 className={'font-semibold'}>Project Expenses </h3>
                            </div>
                            <BarChartComponent data={data?.projectExpenseStats}/>
                        </div>
                        }
                    </div>
                    { data?.assignedTasks &&
                        <div className="w-1/3 bg-white p-2 border border-gray-200 shadow-md rounded-md">
                            <div className="flex flex-col border-b border-gray-100">
                                <h3 className="mb-2 font-semibold">Assigned Tasks</h3>

                                {data?.assignedTasks.map((task, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-2 ${
                                            index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                        }`}
                                    >
                                        <p className="w-[20px] text-center">{`${index + 1}.`}</p>
                                        <p className="flex-1 text-start">{task.name}</p>
                                        <p className="ml-4">{task.status}</p>
                                    </div>
                                ))}

                            </div>
                        </div>
                    }

                </div>
                <div className={'flex bg-white flex-col mt-2 p-2 border border-gray-200 shadow-md rounded-md  '}>
                    <h3 className={'mb-2 font-semibold'}>Sales Dashboard</h3>
                    <div className={'bg-white p-2'}>
                        <div className={'grid grid-cols-6 gap-2 '}>
                            {salesStats.map((item, index) => (
                                <div key={index}
                                     className={'bg-white h-20 flex flex-col justify-center items-center border border-gray-200 shadow-md rounded-md'}>
                                    <p>{item.name}</p>
                                    <p>{item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={'flex mt-2 gap-2'}>
                        <div className={'bg-white shadow-md rounded-md p-2 border border-gray-200'}>
                            <h3 className={'mb-2 font-semibold'}>Sales Vs Purchase</h3>
                            <AreaChartComponent data={[]}/>
                        </div>
                        {
                            data?.projectExpenseStats &&
                            <div className={'w-3/4 border border-gray-200 p-2 shadow-md rounded-md'}>
                                <h3 className={'mb-2 font-semibold'}>Project Expenses </h3>
                                <BarChartComponent data={data?.projectExpenseStats}/>
                            </div>
                        }
                        <div className={'flex flex-col bg-white shadow-md rounded-md border border-gray-200 p-2'}>
                            <div className={'mb-2  shadow-md rounded-md border border-gray-200  p-2'}>
                                <h3 className={'mb-2 font-semibold'}>Years </h3>
                                <div className={'grid grid-cols-2 gap-1'}>
                                    {
                                        years.map(item => (
                                                <button
                                                    key={item}
                                                    className={'border h-10 border-gray-200 gap-2 shadow-md rounded-md mb-1'}
                                                >{item}</button>
                                            )
                                        )}

                                </div>

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