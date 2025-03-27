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
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

const columns = [
    {header: 'Requisition Code', accessor: 'formatted_code'},
    {header: 'Requisition Date', accessor: 'formatted_created_date'},
    {header: 'Store', accessor: 'store_name'},
    {header: 'Store Keeper', accessor: 'store_keeper'},
    {header: 'Items', accessor: 'items', width: "300px"},
    {header: 'Amount (Tzs)', accessor: 'amount',  isAlignRight: true, isMoney: true},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Quantity', accessor: 'quantity', isAlignRight: true },
    { header: 'Price (Tzs)', accessor: 'price' , isAlignRight: true, isMoney: true },
];

function RequisitionRequestReport() {
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const {state}  = useGlobalContextHook()
    const filters = state.filterBody;
    const token = getValueFromLocalStorage('token')
    const url = 'report/procurement/requisition-request'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const final_url = createUrlWithFilters(url, 'requisition-request-report')
                const res = await get(final_url, token)

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
    }, [refresh, filters])

    const pageRender = () =>{
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={'requisition-request-report'}
                statusBody={[
                    {label: 'Pending', value: 1, mappedValue: 'pending'},
                    {label: 'Quotation', value: 1, mappedValue: 'quotation'},
                    {label: 'Request For Quotation', value: 1, mappedValue: 'request_for_quotation'},
                ]}
            />
            <CustomTable
                columns={columns}
                data={data}
                subTableColumns={subTableColumns}
                subTableAccessor="items"
            />
            <div className={'w-full flex justify-end mt-2'}>
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
                            subHeader={'Requisition Requests Report'}
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

export default RequisitionRequestReport