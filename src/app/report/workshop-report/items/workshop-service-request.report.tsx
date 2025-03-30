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
    {header: 'Workshop Request Code', accessor: 'formatted_code'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Service Type', accessor: 'service_request_type'},
    {header: 'Item Name', accessor: 'item_name'},
    {header: 'Cost', accessor: 'amount'},
    {header: 'Warranty Status', accessor: 'warranty_status'},
    {header: 'Status', accessor: 'status'},
];

const subTableColumns: TableColumn[] = [
    { header: 'Name', accessor: 'name' },
    { header: 'Quantity', accessor: 'quantity', isAlignRight: true },
    { header: 'Price (Tzs)', accessor: 'price' , isAlignRight: true, isMoney: true },
];

function WorkshopServiceRequestReport() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetadata] = useState<any>()
    const [loading, setLoading] = useState(false)
    const url = 'report/workshop/workshop-service-request'

    const filter_key = 'workshop-service-report'
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
    }, [filters])



    const pageRender = () =>{
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={filter_key}
                statusBody={[
                    {label: 'Pending', value: 1},
                    {label: 'Submitted', value: 2},
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
                subTableColumns={subTableColumns}
                subTableAccessor="bids"
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Amount:</p>
                        <p>{moneyFormater({amount:metadata?.total, isShowCurrency: true})}</p>
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
                            subHeader={'Purchase Order Report'}
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

export default WorkshopServiceRequestReport