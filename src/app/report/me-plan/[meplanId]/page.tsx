"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import GeneratePdf from '@/components/pdf/generate-pdf'
import {getValueFromLocalStorage} from '@/utils/actions/local-starage'
import {get} from '@/utils/api'
import React, {useEffect, useState} from 'react'

const MEPlan = ({params}: { params: { meplanId: string } }) => {
    const id = params.meplanId
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

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

    const indicatoRowCretor = (item: any, from?: string) => {
        return <div key={item.id} className="flex border-l border-gray-500">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32 p-1 border-r border-b border-gray-500">Indicator:{item.formatted_code}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.name}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.collection_method}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.frequency}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.responsibilities}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.audience}</p>
        </div>
    }

    const assumptionRowCretor = (item: any, from?: string) => {
        return <div key={item.id} className="flex border-l border-gray-500">
            {/* <p className="flex-shrink-0 w-16">{indexer(i)}</p> */}
            <p className="flex-grow w-32 p-1 border-r border-b border-gray-500">Assumption:{item.formatted_code}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.name}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.collection_method}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.frequency}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.responsibilities}</p>
            <p className="flex-grow w-32 p-1  border-r border-b border-gray-500">{item.audience}</p>
        </div>
    }

    const pageBody = () => {
        return (
            <div className='bg-white shadow-md p-2 text-xs'>
                <div className="overflow-x-auto">
                    <div className="min-w-[750px]">
                        <h4 className='mb-1 text-sm'>ME Plan For Project: <span
                            className='font-semibold'>{data?.name}</span></h4>
                        <div className="flex border-l border-t border-b border-gray-500 font-semibold">
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Indicator</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Indicator Definition (and unit of
                                measurement)</p>
                            <p className="flex-grow w-32 p-1 border-r border-gray-500">Data Collection
                                Methods/Sources</p>
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
                                                <p className='w-full border-b border-l border-r border-gray-500 p-1 font-semibold'>Outcome
                                                    : {outcome.formatted_code}</p>
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
                                                <p className='w-full border-b border-l border-r border-gray-500 p-1 font-semibold'>Output
                                                    : {output.formatted_code}</p>
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
                                {name: 'ME Plan', linkTo: '/report/me-plan', permission: ''},
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

export default MEPlan