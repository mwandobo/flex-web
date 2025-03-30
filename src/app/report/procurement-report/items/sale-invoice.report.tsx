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
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import ReportFilterComponent from "@/components/report-filter.component";

const columns = [
    {header: 'Invoice Code', accessor: 'formatted_code'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'SO Code', accessor: 'purchase_order_name'},
    {header: 'Rfq Code', accessor: 'rfq_name'},
    {header: 'Quotation Code', accessor: 'quotation_name'},
    {header: 'Customer Name', accessor: 'customer_name'},
    {header: 'Payments', accessor: 'payments', width: '20%'},
    {header: 'Paid Amount (Tzs)', accessor: 'paid_amount',  isAlignRight: true, isMoney: true},
    {header: 'Pending Amount (Tzs)', accessor: 'remaining_amount',  isAlignRight: true, isMoney: true},
    {header: 'Total Amount (Tzs)', accessor: 'amount',  isAlignRight: true, isMoney: true},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Amount', accessor: 'amount', isAlignRight: true },
    { header: 'Status', accessor: 'status'},
];

function SaleInvoiceReport() {
    const [data, setData] = useState<any>([])
    const [other, setOther] = useState<any>()
    const [loading, setLoading] = useState(false)
    const url = 'report/procurement/sale-invoice'

    const filter_key = 'sale-invoice-report'
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
                    setOther({total_amount: res.data.data.total_amount, total_paid: res.data.data.total_paid, total_remaining: res.data.data.total_remaining})
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
                    {label: 'Payment', value: 2},
                    {label: 'Paid', value: 3},
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
                        <p className={'border-r py-1 border-b border-gray-200 pr-2'}> Total Paid:</p>
                        <p className={'pl-2 py-1 border-b border-gray-200 '}>{moneyFormater({amount: other?.total_paid, isShowCurrency: true})}</p>
                        <p className={'border-r py-1  border-b border-gray-200 pr-2'}> Total Pending:</p>
                        <p className={'pl-2 py-1 border-b border-gray-200'}>{moneyFormater({amount: other?.total_remaining, isShowCurrency: true})}</p>
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

export default SaleInvoiceReport