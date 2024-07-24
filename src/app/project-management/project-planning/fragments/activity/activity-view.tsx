"use client"

import Indicator from "@/app/project-management/fragments/indicator";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import Task from "../task/task";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { statusFormatter } from "@/utils/actions/status-formatter";
import FormattedMoney from "@/components/moneyFormater";
import Assignment from "@/app/project-management/fragments/assignment";
import Assumption from "@/app/project-management/fragments/assumption";
import Cost from "@/app/project-management/fragments/costs";
import Deliverable from "@/app/project-management/fragments/deliverable";
import Resource from "@/app/project-management/fragments/resource";
import Risk from "@/app/project-management/fragments/risk";
import FileUploadForm from "@/app/project-management/fragments/document";


interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    project_id?: string | null
    project?: any
    output_id?: string | null
    activity_id?: string
}

const ActivityShow = (
    {
        project_id,
        activity_id,
        output_id,
        project,
        callBackFunction

    }: Props
) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`activity/${project_id}/${output_id}/show/${activity_id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [activity_id, output_id, project_id, token])


    const nodes: React.ReactNode[] = [
        <Indicator
            key={'task'}
            project_id={project_id}
            from='activity'
            from_id={activity_id}
            means_of_verification={data.measurement_type_id}
        />,
        <Assignment
            project={project}
            key={'assignment'}
            activity_id={activity_id}
        />,
        <Resource
            key={'resource'}
            activity_id={activity_id}
            project_id={project_id}
        />,
        <Cost
            key={'cost'}
            activity_id={activity_id}
            project_id={project_id}
        />,
        <Deliverable
            key={'delivareble'}
            activity_id={activity_id}
            project_id={project_id}
        />,
        <Assumption
            key={'assumption'}
            from={'activity'}
            from_id={activity_id}
            project_id={project_id}
        />,
        <Risk
            key={'risk'}
            activity_id={activity_id}
            project_id={project_id}
        />,
        <FileUploadForm
            key={'file'}
            activity_id={activity_id}
            project_id={project_id}
        />
    ];


    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            subHeader={``}
                            links={[]}
                            isShowPage={true}
                            isHideBack={true}

                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    { label: 'Code', value: data.formatted_code },
                                    { label: 'Activity Name', value: data?.name },
                                    { label: 'Project ', value: data?.project },
                                    { label: 'Start Date', value: data.formatted_start_date },
                                    { label: 'End Date', value: data.formatted_end_date },
                                    { label: 'Progress (%)', value: statusFormatter(data.progress) },
                                    { label: 'Direct Cost Budget', value: <FormattedMoney amount={data.cost} /> },
                                    { label: 'Resource Cost Budget', value: <FormattedMoney amount={data.resource_cost} /> },
                                    { label: 'Total Cost Budget', value: <FormattedMoney amount={data.total_cost} /> },
                                ]}
                                titleA="Project Activity"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        {/* {Number(passedData?.status) === 1 && */}
                        <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "Indicator",
                                    "Assignment",
                                    "Resource Cost Budget",
                                    "Direct Cost Budget",
                                    "Deliverables",
                                    "Assumptions",
                                    "Risks",
                                    "Documents"
                                ]}
                                nodes={nodes}
                            >
                            </MuiTab>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ActivityShow;