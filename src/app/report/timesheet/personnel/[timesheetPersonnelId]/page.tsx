

"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useEffect, useState} from 'react'
import PageHeader from "@/components/header/page-header";
import GeneratePdf from "@/components/pdf/generate-pdf";
import {get} from "@/utils/api";
import CustomTable from "@/components/tables/flexible-normal-table";

const columns = [
    {header: 'Activity Name', accessor: 'activity_name'},
    {header: 'Task Name', accessor: 'name'},
    {header: 'Start Date', accessor: 'formatted_start_date'},
    {header: 'End Date', accessor: 'formatted_end_date'},
    {header: 'Status', accessor: 'status'},
];

const TimesheetPersonnelShow = ({ params }: { params: { timesheetPersonnelId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const id = params.timesheetPersonnelId
    const url = `report/timesheet/personnel/${id}`

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url)

                if ( res.status === 200) {
                    console.log('response data' , res.data.data.data)
                    setData(res.data.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    console.log('an error happened')
                }
            }
        };
        fetchData()
    }, [])

    const pageRender = () =>{
        return <div className={'mt-2'}>
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
                            subHeader={`Timesheet Report for Employee ${data?.employee_name}`}
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

export default TimesheetPersonnelShow