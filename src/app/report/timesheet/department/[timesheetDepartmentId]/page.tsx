

"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import CustomTable from "@/components/tables/flexible-normal-table";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {createUrlWithFilters} from "@/utils/report-filter.helper";
import ReportFilterComponent from "@/components/report-filter.component";

const columns = [
    {header: 'Activity Name', accessor: 'activity_name'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Task Name', accessor: 'name'},
    {header: 'Start Date', accessor: 'formatted_start_date'},
    {header: 'End Date', accessor: 'formatted_end_date'},
    {header: 'Status', accessor: 'status'},
];

const TimesheetDepartmentShow = ({ params }: { params: { timesheetDepartmentId: string } }) => {
    const [data, setData] = useState<any>([])
    const [department, setDepartment] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const id = params.timesheetDepartmentId
    const url = `report/timesheet/department/${id}`


    const filter_key = 'timesheet-department-report'
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
                    setDepartment(res.data.data.department)
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
                isApprovalFilter={false}
            />
            <CustomTable
                columns={columns}
                data={data}
            />
        </div>
    }

    return (
        <ProtectedRoute>
            <>
                {loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            subHeader={`Timesheet Report for Department ${department?.name}`}
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

export default TimesheetDepartmentShow