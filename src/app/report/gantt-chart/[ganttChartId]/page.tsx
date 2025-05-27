"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import GeneratePdf from '@/components/pdf/generate-pdf'
import {getValueFromLocalStorage} from '@/utils/actions/local-starage'
import {get} from '@/utils/api'
import React, {useEffect, useState} from 'react'

const GanttChart = ({params}: { params: { ganttChartId: string } }) => {
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
        return <div key={item.id} className="flex border-l border-gray-500">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32 p-1 border-r border-b border-gray-500">{item.formatted_code}</p>
            <p className="flex-grow w-48 p-1  border-r border-b border-gray-500">{item.name}</p>
            <p className="flex-grow w-24 p-1  border-r border-b border-gray-500">{item.cost}</p>
            <p className="flex-grow w-24 p-1  border-r border-b border-gray-500">{item.duration}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{from !== "activity" ? item.start_date : item.formatted_start_date}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{from !== "activity" ? item.end_date : item.formatted_end_date}</p>
            {
                (item.assignments.department_assignments &&
                    item.assignments.department_assignments.length > 0) ?
                    <p className='flex flex-col flex-grow w-32 p-1  border-r border-b border-gray-500'>
                        {item.assignments.department_assignments.map(dept_assign =>
                            <span key={dept_assign.id}>{
                                dept_assign.personnel_department}</span>
                        )}
                    </p> :
                    <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>.....</p>
            }

            {
                (item.assignments.personnel_assignments &&
                    item.assignments.personnel_assignments.length > 0) ?
                    <p className='flex flex-col flex-grow w-32 p-1  border-r border-b border-gray-500'>
                        {item.assignments.personnel_assignments.map(dept_assign =>
                            <span key={dept_assign.id}>{
                                dept_assign.personnel_department}</span>
                        )}
                    </p> :
                    <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>.....</p>
            }

        </div>
    }

    const pageBody = () => {
        return (
            <div className='bg-white shadow-md p-2 text-xs'>
                <div className="overflow-x-auto">
                    <div className="min-w-[750px]">
                        <h4 className='mb-1 text-sm'>Gantt Chart For Project: <span
                            className='font-semibold'>{data?.name}</span>
                        </h4>
                        <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">WBS</p>
                            <p className="flex-grow w-48 p-1 border-r border-gray-500">Task Name</p>
                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Cost</p>
                            <p className="flex-grow w-24 p-1 border-r border-gray-500">Duration</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Start</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Finish</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Department</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Resource Names</p>
                        </div>
                        <div className='flex flex-col bg-gray-50 '>
                            {
                                data?.goals?.length > 0 && data.goals.map((goal: any, i: any) =>
                                    <div key={goal.id}>
                                        {rowCretor(goal)}
                                        {goal?.outcomes.length > 0 && goal?.outcomes.map((outcome: any, index: any) => {
                                            return rowCretor(outcome)
                                        })}
                                        {goal?.outputs.length > 0 && goal?.outputs.map((output: any, index: any) => {
                                            return rowCretor(output)
                                        })}
                                        {goal?.activities.length > 0 && goal?.activities.map((activity: any, index: any) => {
                                            return rowCretor(activity, "activity")
                                        })}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {name: 'Gantt Chart', linkTo: '/report/gantt-chart', permission: ''},
                                {name: 'Show', linkTo: '/projects/show', permission: ''},
                            ]}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={<GeneratePdf
                                content={pageBody()}
                                fileName="MyDocument.pdf"
                                buttonLabel="Generate PDF"
                            />}
                        />
                        {pageBody()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default GanttChart