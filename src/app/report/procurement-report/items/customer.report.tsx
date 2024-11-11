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
    {header: 'Customer Name', accessor: 'name'},
    {header: 'Customer Email', accessor: 'email'},
    {header: 'Customer Phone', accessor: 'phone'},
    {header: 'Customer Address', accessor: 'address'},
    {header: 'Status', accessor: 'status'},
];

function CustomerReport() {
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/procurement/customer'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if ( res.status === 200) {
                    setData(res.data.data.data)
                    setTotal(res.data.data.total)
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
            {/*<div className={'w-full flex justify-end mt-2'}>*/}
            {/*    <div>*/}
            {/*        <h3 className={'text-xs font-medium'}>Summary</h3>*/}
            {/*        <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>*/}
            {/*            <p className={'border-r border-gray-400 pr-2'}> Total Amount:</p>*/}
            {/*            <p>{moneyFormater({amount:total, isShowCurrency: true})}</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    }

    return (
        <ProtectedRoute>
            <>
                {loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            subHeader={'Customer Report'}
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

export default CustomerReport