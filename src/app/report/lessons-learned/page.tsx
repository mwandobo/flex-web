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
import ReportFilterComponent from "@/components/report-filter.component";
import {createUrlWithFilters} from "@/utils/report-filter.helper";

const columns = [
    {header: 'Project Name', accessor: 'project_name'},
    {header: 'Prepared By', accessor: 'user_name'},
    {header: 'Date', accessor: 'formatted_created_date'},
    {header: 'Lesson Title ', accessor: 'title'},
    {header: 'Description', accessor: 'description'},
    {header: 'Status', accessor: 'status'},
];

function ProjectReport() {
    const [data, setData] = useState<any>([])
    const [metadata, setMetaData] = useState<any>()
    const [loading, setLoading] = useState(false)
    const url = 'report/project/lessons-learned'
    const filter_key = 'lessons-learned'
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
                    setMetaData(res.data.data.metadata)
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
                byProject={true}
                byEmployee={true}
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
                            subHeader={'Lessons Learned Report'}
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

export default ProjectReport