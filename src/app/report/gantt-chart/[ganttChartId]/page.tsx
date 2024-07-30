"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { get } from '@/utils/api'
import React, { useEffect, useState } from 'react'

const GanttChart = ({ params }: { params: { ganttChartId: string } }) => {
    const id = params.ganttChartId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')

    const url = `reports/gantt-chart/show/${id}`

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true)
                const res = await get(url, token)
                if (res && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }
            }
        };
        fetchData()
    }, [url, token])


    const rowCretor = (item: any, from?: string) => {
        return <div className="flex">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32">{item.formatted_code}</p>
            <p className="flex-grow w-48">{item.name}</p>
            <p className="flex-grow w-24">{item.cost}</p>
            <p className="flex-grow w-24">{item.duration}</p>
            <p className="flex-grow w-32">{from !== "activity" ? item.start_date : item.formatted_start_date}</p>
            <p className="flex-grow w-32">{from !== "activity" ? item.end_date : item.formatted_end_date}</p>
            <p className="flex-grow w-24">OBS</p>
            <p className="flex-grow w-48">Resource Names</p>
        </div>
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <div className="flex">
                            {/* <p className="flex-shrink-0 w-16">ID</p> */}
                            <p className="flex-grow w-32">WBS</p>
                            <p className="flex-grow w-48">Task Name</p>
                            <p className="flex-grow w-24">Cost</p>
                            <p className="flex-grow w-24">Duration</p>
                            <p className="flex-grow w-32">Start</p>
                            <p className="flex-grow w-32">Finish</p>
                            <p className="flex-grow w-24">Department</p>
                            <p className="flex-grow w-48">Resource Names</p>
                        </div>
                        <div className='flex flex-col bg-gray-50 '>
                            {
                                data?.goals?.length > 0 && data.goals.map((goal: any, i: any) =>
                                    <>
                                        {rowCretor(goal)}
                                        {goal?.outcomes.length > 0 && goal?.outcomes.map((outcome: any, index: any) => { return rowCretor(outcome) })}
                                        {goal?.outputs.length > 0 && goal?.outputs.map((output: any, index: any) => { return rowCretor(output) })}
                                        {goal?.activities.length > 0 && goal?.activities.map((activity: any, index: any) => { return rowCretor(activity, "activity") })}
                                    </>
                                )}
                        </div>
                    </>
            }
        </ProtectedRoute>
    )
}

export default GanttChart