"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
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
    {header: 'Resource Type', accessor: 'resource_type_name'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Resource Name', accessor: 'resource_name'},
    {header: 'Project Name', accessor: 'project_name'},
    {header: 'Activity Name', accessor: 'activity_name'},
    {header: 'Requested Date', accessor: 'formatted_requested_date'},
    {header: 'Dispatched Date', accessor: 'formatted_dispatched_date'},
    {header: 'Quantity', accessor: 'quantity', isAlignRight: true},
    {header: 'Amount', accessor: 'amount', isAlignRight: true, isMoney: true},
    {header: 'Status', accessor: 'status'},
];

function ResourceRequestReport() {
    const [data, setData] = useState<any>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/procurement/resource-request'

    const filter_key = 'resource-report'
    const {state}  = useGlobalContextHook()
    const filters = state.filterBody;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const final_url = createUrlWithFilters(url, filter_key)
                const res = await get(final_url )

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
    }, [filters])

    const pageRender = () => {
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={filter_key}
                statusBody={[
                    {label: 'Pending', value: 1},
                    {label: 'Submitted', value: 2},
                    {label: 'Partial Dispatched', value: 3},
                    {label: 'Dispatched', value: 4},
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Amount:</p>
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
                            subHeader={'Resource Request Report'}
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

export default ResourceRequestReport