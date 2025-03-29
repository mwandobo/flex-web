"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import {TableColumn} from "@/components/tables/normal-table";
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import CustomTable from "@/components/tables/flexible-normal-table";
import moneyFormater from "@/components/moneyFormater";
import ReportFilterComponent from "@/components/report-filter.component";
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

const columns = [
    {header: 'Rfq Code', accessor: 'formatted_code'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Requisition Code', accessor: 'requisition_request_name'},
    {header: 'Payment Method', accessor: 'payment_method'},
    {header: 'Evaluation Method', accessor: 'evaluation_method'},
    {header: 'Decision Timeline', accessor: 'decision_timeline', },
    {header: 'Delivery Time', accessor: 'delivery_time'},
    {header: 'Items', accessor: 'items', width: "300px"},
    {header: 'Amount (Tzs)', accessor: 'amount',  isAlignRight: true, isMoney: true},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Quantity', accessor: 'quantity', isAlignRight: true },
    { header: 'Price (Tzs)', accessor: 'price' , isAlignRight: true, isMoney: true },
];

function PurchaseRfqReport() {
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const url = 'report/procurement/purchase-rfq'

    const filter_key = 'purchase-order-report'
    const {state}  = useGlobalContextHook()
    const filters = state.filterBody;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const final_url = createUrlWithFilters(url, filter_key)
                const res = await get(final_url )

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
    }, [filters])

    const pageRender = () =>{
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={filter_key}
                statusBody={[
                    {label: 'Pending', value: 1},
                    {label: 'Quotation', value: 2},
                    {label: 'Winner Selected', value: 3},
                    {label: 'Purchase Order', value: 4},
                    {label: 'Invoice', value: 5},
                    {label: 'Payment', value: 6},
                    {label: 'Paid', value: 7},
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
                subTableColumns={subTableColumns}
                subTableAccessor="items"
            />
            <div className={'w-full flex justify-end mt-2 mb-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Amount:</p>
                        <p>{moneyFormater({amount:total, isShowCurrency: true})}</p>
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
                            subHeader={'Request For Quotation Report'}
                            isShowPage={true}
                            isDownload={true}
                            filter={filter_key}
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

export default PurchaseRfqReport