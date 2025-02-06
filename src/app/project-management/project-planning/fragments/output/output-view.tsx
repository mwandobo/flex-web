"use client"

import Indicator from "@/app/project-management/fragments/indicator";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import Activity from "../activity/activity";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { statusFormatter } from "@/utils/actions/status-formatter";
import FormattedMoney from "@/components/moneyFormater";
import Assignment from "@/app/project-management/fragments/assignment";
import AssumptionConstraint from "@/app/project-management/fragments/assumption_constraint";

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    outcome_id?: string
    project_id?: string | null
    project?: any
    output_id?: string | null
}

const OutputShow = (
    {
        project_id,
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
            const res = await get(`project_output/${output_id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [])


    const nodes: React.ReactNode[] = [
        <Activity
            key={'output'}
            project={project}
            project_id={project_id}
            output_id={output_id}
            selectedViewCard="activity/show"
            callBackFunction={callBackFunction}
            isHideAdd={project?.status === 'closed'}
        />,
        <Indicator
            key={'output'}
            project_id={project_id}
            from='output'
            from_id={output_id}
            means_of_verification={data.measurement_type_id}
        />,
        <Assignment
            project={project}
            key={'assignment'}
            from='output'
            from_id={output_id}
        />,
        <AssumptionConstraint
            key={'assumption'}
            from_id={output_id}
            from="output"
            project={project}
        />,
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
                                    { label: 'Output Name', value: data?.name },
                                    { label: 'Project ', value: data?.project },
                                    { label: 'Start Date', value: data.start_date },
                                    { label: 'End Date', value: data.end_date },
                                    { label: 'Progress (%)', value: statusFormatter(data.progress) },
                                    { label: 'Direct Cost  Budget', value: <FormattedMoney amount={data.cost} /> },
                                    { label: 'Resource Cost Budget ', value: <FormattedMoney amount={data.resource_cost} /> },
                                    { label: 'Total Cost Budget', value: <FormattedMoney amount={data.total_cost} /> },
                                ]}
                                titleA="Project Outputs"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        {/* {Number(passedData?.status) === 1 && */}
                        <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "Activities",
                                    "Indicators",
                                    "Assignments",
                                    "Assumptions",
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

export default OutputShow;