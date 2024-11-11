"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import CustomTable from "@/components/tables/flexible-normal-table";
import moneyFormater from "@/components/moneyFormater";

const columns = [
    {header: 'Cost Name', accessor: 'name'},
    {header: 'Description', accessor: 'purpose'},
    {header: 'Project Name', accessor: 'project_name'},
    {header: 'Activity Name', accessor: 'activity_name'},
    {header: 'Requested Date', accessor: 'formatted_requested_date'},
    {header: 'Dispatched Date', accessor: 'formatted_dispatched_date'},
    {header: 'Status', accessor: 'status'},
    {header: 'Requested Amount', accessor: 'amount', isAlignRight: true, isMoney: true},
    {header: 'Dispatched Amount', accessor: 'dispatched_amount', isAlignRight: true, isMoney: true},
    {header: 'Remained Amount', accessor: 'remained_amount', isAlignRight: true, isMoney: true},
    // {header: 'Status', accessor: 'status'},
];

function FundRequestReport() {
    const [data, setData] = useState<any>([])
    const [other, setOther] = useState<any>(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/procurement/fund-request'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if ( res.status === 200) {
                    setData(res.data.data.data)
                    setOther({
                        total_requested: res.data.data.total_requested,
                        total_dispatched: res.data.data.total_dispatched,
                        total_remained: res.data.data.total_remained,
                    })
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    console.log('an error happened')
                }
            }
        };
        fetchData()
    }, [refresh])

    const pageRender = () =>{
        return <div className={'mt-2'}>
            <CustomTable
                columns={columns}
                data={data}
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 py-1 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Requested Amount:</p>
                        <p className={'pl-2 '}>{moneyFormater({amount: other.total_requested, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Dispatched Amount:</p>
                        <p className={'pl-2 '}>{moneyFormater({amount: other.total_dispatched, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Pending Amount:</p>
                        <p className={'pl-2 '}>{moneyFormater({amount: other.total_remained, isShowCurrency: true})}</p>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <ProtectedRoute>
            <>
                {loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            subHeader={'Store Report'}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={
                                <GeneratePdf
                                    content={pageRender()}
                                    fileName="MyDocument.pdf"
                                    buttonLabel="Generate PDF"
                                />
                            }
                        />
                        {pageRender()}
                    </>
                }
            </>
        </ProtectedRoute>
    )
}

export default FundRequestReport