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
    {header: 'Delivery Code', accessor: 'formatted_code'},
    {header: 'Type', accessor: 'type'},
    {header: 'Purchase Order', accessor: 'purchase_order_name'},
    {header: 'Rfq', accessor: 'rfq_name'},
    {header: 'Quotation Code', accessor: 'quotation_name'},
    {header: 'Delivery Cost', accessor: 'delivery_cost', isAlignRight: true, isMoney: true},
    {header: 'Delivery Date', accessor: 'formatted_delivery_date'},
    {header: 'Delivery Address', accessor: 'delivery_address'},
    {header: 'Items', accessor: 'items_1', width: "23%"},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'PO Quantity', accessor: 'po_quantity', isAlignRight: true },
    { header: 'Delivered Quantity', accessor: 'de_quantity', isAlignRight: true },
];

function DeliveryReport() {
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/procurement/delivery'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (res.status === 200) {
                    setData(res.data.data.data)
                    setTotal(res.data.data.total_amount)
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
                subTableColumns={subTableColumns}
                subTableAccessor="items_1"
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Delivery Amount:</p>
                        <p>{moneyFormater({amount: total, isShowCurrency: true})}</p>
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
                            subHeader={'Deliveries Report'}
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

export default DeliveryReport