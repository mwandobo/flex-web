"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { ReusableButton } from '@/components/button/reusable-button'
import PageHeader from '@/components/header/page-header'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { baseURL, get } from '@/utils/api'
import { Download, FileDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const GanttChart = ({ params }: { params: { ganttChartId: string } }) => {
    const id = params.ganttChartId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [pdfData, setPdfData] = useState<any>(null);
    const [isloadingGenaratePdf, setIsLoadingGeneratePdf] = useState(false)

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

    const handleClick = async () => {
        return await generatePdf()
    }

    const refreshDownloadButton = () => {
        setIsDownloading(false)
    }

    const generatePdf = async () => {
        const strippedToken = token?.substring(1, token.length - 1)

        setIsLoadingGeneratePdf(true);
        try {
            const response = await fetch(`${baseURL}/reports/generate_pdf/${id}`, {
                headers: {
                    'Authorization': `Bearer ${strippedToken}`, // Include token if authentication is required
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const pdfBlob = await response.blob();

            setPdfData(URL.createObjectURL(pdfBlob));
            setIsDownloading(true);
        } catch (error) {
            console.error('Error in testFetch', error);
        } finally {
            setIsLoadingGeneratePdf(false);
        }
    };


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
                from === 'activity' ?
                    <>
                        {
                            (item.assignments.department_assignments &&
                                item.assignments.department_assignments.length > 0) ?
                                <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>
                                    {item.assignments.department_assignments.map(dept_assign =>
                                        <span key={dept_assign.id}>{
                                            dept_assign.personnel_department}</span>
                                    )}
                                </p> :
                                <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>no assignment</p>
                        }
                    </> :
                    <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>....</p>
            }
            {
                from === 'activity' ?
                    <>
                        {
                            (item.assignments.personnel_assignments &&
                                item.assignments.personnel_assignments.length > 0) ?
                                <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>
                                    {item.assignments.personnel_assignments.map(dept_assign =>
                                        <span key={dept_assign.id}>{
                                            dept_assign.personnel_department}</span>
                                    )}
                                </p> :
                                <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>no assignment</p>
                        }
                    </> : <p className='flex-grow w-32 p-1  border-r border-b border-gray-500'>....</p>
            }
        </div>
    }

    const ButtonDownloadComponent = () => {
        return (
            <>
                {
                    isloadingGenaratePdf ?
                        <p className="text-xs">Generating PDF ...</p>
                        :
                        <>
                            {
                                isDownloading ?
                                    <div className="flex gap-3 items-center">
                                        <p className="text-xs">{`${data.project_name}.pdf`}</p>
                                        <a className="flex text-xs items-center text-blue-700 shadow px-2 py-1 hover:bg-green-600 hover:text-white hover:px-3  hover:py-1" href={pdfData} download={`${data.project_name}.pdf`} onClick={refreshDownloadButton}>
                                            <Download className="me-1" size={15} />  Download PDF
                                        </a>
                                    </div>
                                    :
                                    < div className=''>
                                        <ReusableButton
                                            name={'Download'}
                                            onClick={() => handleClick()}
                                        >
                                            <FileDown size={15} />
                                        </ReusableButton>
                                    </div>
                            }
                        </>
                }
            </>
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
                                { name: 'Gantt Chart', linkTo: '/report/gantt-chart', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={ButtonDownloadComponent}
                        />
                        <div className='bg-white shadow-md p-2 text-xs'>
                            <h4 className='mb-1 text-sm'>Gantt Chart For Project: <span className='font-semibold'>{data?.name}</span> </h4>
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
                                            {goal?.outcomes.length > 0 && goal?.outcomes.map((outcome: any, index: any) => { return rowCretor(outcome) })}
                                            {goal?.outputs.length > 0 && goal?.outputs.map((output: any, index: any) => { return rowCretor(output) })}
                                            {goal?.activities.length > 0 && goal?.activities.map((activity: any, index: any) => { return rowCretor(activity, "activity") })}
                                        </div>
                                    )}
                            </div>
                        </div>

                    </>
            }
        </ProtectedRoute>
    )
}

export default GanttChart