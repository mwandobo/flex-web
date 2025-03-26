"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import CustomTable from "@/components/tables/flexible-normal-table";
import moneyFormater from "@/components/moneyFormater";
import {TableColumn} from "@/components/tables/normal-table";

const columns = [
    {header: 'Repair Code', accessor: 'formatted_code'},
    {header: 'Repair Type', accessor: 'maintenance_type'},
    {header: 'Item Type', accessor: 'formatted_item_type'},
    {header: 'Item Name', accessor: 'maintenance_item_name'},
    {header: 'Inspection Cost', accessor: 'amount', isAlignRight: true, isMoney: true},
    {header: 'Inspected By', accessor: 'maintained_by_name'},
    {header: 'Warranty Status', accessor: 'warranty_status'},
    {header: 'Status', accessor: 'status'},
];

function RepairReport() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetadata] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/workshop/repair'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (res.status === 200) {
                    setData(res.data.data.data)
                    setMetadata(res.data.data.metadata)
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

    const pageRender = () => {
        return <div className={'mt-2'}>
            <CustomTable
                columns={columns}
                data={data}
                subTableAccessor="bids"
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Repair Cost:</p>
                        <p>{moneyFormater({amount: metadata?.total, isShowCurrency: true})}</p>
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
                            subHeader={'Repair Report'}
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

export default RepairReport