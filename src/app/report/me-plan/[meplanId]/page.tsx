"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { ReusableButton } from '@/components/button/reusable-button'
import PageHeader from '@/components/header/page-header'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { baseURL, get } from '@/utils/api'
import { Download, FileDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const MEPlan = ({ params }: { params: { meplanId: string } }) => {
    const id = params.meplanId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [pdfData, setPdfData] = useState<any>(null);
    const [isloadingGenaratePdf, setIsLoadingGeneratePdf] = useState(false)

    const token = getValueFromLocalStorage('token')

    const url = `reports/meplan/show/${id}`

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

    const indicatoRowCretor = (item: any, from?: string) => {
        return <div key={item.id} className="flex border-l border-gray-500">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32 p-1 border-r border-b border-gray-500">Indicator:{item.formatted_code}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.name}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.measurement}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.frequency}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.responsibility}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.audiance}</p>
        </div>
    }

    const assumptionRowCretor = (item: any, from?: string) => {
        return <div key={item.id} className="flex border-l border-gray-500">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32 p-1 border-r border-b border-gray-500">Assumption:{item.formatted_code}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.name}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.measurement}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.frequency}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.responsibility}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.audiance}</p>
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
                            <h4 className='mb-1 text-sm'>ME Plan For Project: <span className='font-semibold'>{data?.name}</span> </h4>
                            <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">Indicator</p>
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">Indicator Definition (and unit of measurement)</p>
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">Data Collection Methods/Sources</p>
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">Frequency and Scehedule</p>
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">Responsibilities</p>
                                <p className="flex-grow w-32 p-1 border-r border-gray-500">information use/audiance</p>
                            </div>
                            <div className='flex flex-col bg-gray-50 '>
                                {
                                    data?.goals?.length > 0 && data.goals.map((goal: any, i: any) =>
                                        <div key={goal.id}>
                                            <p className='w-full border-b border-l border-r border-gray-500 p-1 font-semibold'>Goal: {goal.formatted_code}</p>
                                            {goal?.indicators.length > 0 && goal?.indicators.map((indicator: any, index: any) => {
                                                return <>
                                                    {indicatoRowCretor(indicator)}
                                                </>
                                            })}
                                            {goal?.assumptions.length > 0 && goal?.assumptions.map((assumption: any, index: any) => {
                                                return <>
                                                    {assumptionRowCretor(assumption)}
                                                </>
                                            })}
                                            {goal?.outcomes.length > 0 && goal?.outcomes.map((outcome: any, index: any) => {
                                                return <>
                                                    <p className='w-full border-b border-l border-r border-gray-500 p-1 font-semibold'>Outcome : {outcome.formatted_code}</p>
                                                    {outcome?.indicators.length > 0 && outcome?.indicators.map((indicator: any, index: any) => {
                                                        return <>
                                                            {indicatoRowCretor(indicator)}
                                                        </>
                                                    })}
                                                    {outcome?.assumptions.length > 0 && outcome?.assumptions.map((assumption: any, index: any) => {
                                                        return <>
                                                            {assumptionRowCretor(assumption)}
                                                        </>
                                                    })}
                                                </>
                                            })}

                                            {goal?.outputs.length > 0 && goal?.outputs.map((output: any, index: any) => {
                                                return <>
                                                    <p className='w-full border-b border-l border-r border-gray-500 p-1 font-semibold'>Output : {output.formatted_code}</p>
                                                    {output?.indicators.length > 0 && output?.indicators.map((indicator: any, index: any) => {
                                                        return <>
                                                            {indicatoRowCretor(indicator)}
                                                        </>
                                                    })}
                                                    {output?.assumptions.length > 0 && output?.assumptions.map((indicator: any, index: any) => {
                                                        return <>
                                                            {assumptionRowCretor(indicator)}
                                                        </>
                                                    })}

                                                </>
                                            })}
                                        </div>
                                    )}
                            </div>
                        </div>

                    </>
            }
        </ProtectedRoute>
    )
}

export default MEPlan