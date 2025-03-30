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
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import ReportFilterComponent from "@/components/report-filter.component";

const columns = [
    {header: 'Maintenance Code', accessor: 'formatted_code'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Maintenance Type', accessor: 'maintenance_type'},
    {header: 'Item Type', accessor: 'formatted_item_type'},
    {header: 'Item Name', accessor: 'maintenance_item_name'},
    {header: 'Maintenance Cost', accessor: 'amount', isAlignRight: true, isMoney: true},
    {header: 'Maintained By', accessor: 'maintained_by_name'},
    {header: 'Warranty Status', accessor: 'warranty_status'},
    {header: 'Status', accessor: 'status'},
];

function MaintenanceReport() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetadata] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const url = 'report/workshop/maintenance'

    const filter_key = 'maintenance-report'
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

    const pageRender = () => {
        return <div className={'mt-2'}>
            <ReportFilterComponent
                from={filter_key}
                statusBody={[
                    {label: 'Pending', value: 1},
                    {label: 'In Progress', value: 2},
                    {label: 'Completed', value: 3},
                ]}
                isApprovalFilter={true}
            />
            <CustomTable
                columns={columns}
                data={data}
                subTableAccessor="bids"
            />
            <div className={'w-full flex justify-end mt-2'}>
                <div>
                    <h3 className={'text-xs font-medium'}>Summary</h3>
                    <div className={'grid grid-cols-2 gap-2 text-xs font-medium'}>
                        <p className={'border-r border-gray-400 pr-2'}> Total Maintenance Cost:</p>
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
                            subHeader={'Maintenance Report'}
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

export default MaintenanceReport