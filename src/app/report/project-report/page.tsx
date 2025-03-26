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
    {header: 'Project Name', accessor: 'name'},
    {header: 'Start Date', accessor: 'start_date'},
    {header: 'End Date', accessor: 'end_date'},
    {header: 'Owner', accessor: 'owner'},
    {header: 'Status', accessor: 'status'},
    {header: 'Progress', accessor: 'progress_status'},
    {header: 'Total Budget', accessor: 'total_budget',isAlignRight: true, isMoney: true},
    {header: 'Total Expenses (Tzs)', accessor: 'total_expense',  isAlignRight: true, isMoney: true},
    {header: 'Total Asset Value (Tzs)', accessor: 'total_asset_value', isAlignRight: true, isMoney: true },
    {header: 'Total Sale (Tzs)', accessor: 'total_sale', isAlignRight: true, isMoney: true},
];

function ProjectReport() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetaData] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/project/project'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if ( res.status === 200) {
                    setData(res.data.data.data)
                    setMetaData(res.data.data.metadata)
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
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Budget:</p>
                        <p>{moneyFormater({amount: metadata?.total_budget, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Expense:</p>
                        <p>{moneyFormater({amount: metadata?.total_expense, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Asset Value:</p>
                        <p>{moneyFormater({amount: metadata?.total_asset, isShowCurrency: true})}</p>
                        <p className={'border-r border-gray-400 pr-2'}> Total Sale:</p>
                        <p>{moneyFormater({amount: metadata?.total_sale, isShowCurrency: true})}</p>
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
                            subHeader={'Project Report'}
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

export default ProjectReport