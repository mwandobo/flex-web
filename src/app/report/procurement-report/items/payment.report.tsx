"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import {TableColumn} from "@/components/tables/normal-table";
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import CustomTable from "@/components/tables/flexible-normal-table";
import moneyFormater from "@/components/moneyFormater";
import ReportFilterComponent from "@/components/report-filter.component";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {createUrlWithFilters} from "@/utils/report-filter.helper";

const columns = [
    {header: 'Payment Code', accessor: 'formatted_code'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Invoice Code', accessor: 'invoice_name'},
    {header: 'PO Code', accessor: 'purchase_order_name'},
    {header: 'Paid Amount (Tzs)', accessor: 'amount',  isAlignRight: true, isMoney: true},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: 'amount', isAlignRight: true },
    { header: 'Status', accessor: 'status'},
];

function PaymentReport() {
    const [data, setData] = useState<any>([])
    const [other, setOther] = useState<any>()
    const [loading, setLoading] = useState(false)
    const url = 'report/procurement/payment'

    const filter_key = 'payment-report'
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
                    setOther({total_amount: res.data.data.total_amount})
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
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
                subTableColumns={subTableColumns}
                subTableAccessor="payments"
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium mb-1'}>Summary</h3>
                    <div className={'grid grid-cols-2 text-xs font-medium'}>
                 <p className={'border-rpy-1 border-b border-gray-200 pr-2'}> Total Amount:</p>
                        <p className={'pl-2 py-1 border-b border-gray-200'}>{moneyFormater({amount: other?.total_amount, isShowCurrency: true})}</p>
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
                            subHeader={'Internal Invoice Report'}
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

export default PaymentReport