"use client"

import Indicator from "@/app/project-management/fragments/indicator";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import Output from "../output/output";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { statusFormatter } from "@/utils/actions/status-formatter";
import FormattedMoney from "@/components/moneyFormater";
import Assignment from "@/app/project-management/fragments/assignment";
import AssumptionConstraint from "@/app/project-management/fragments/assumption_constraint";

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    outcome_id?: string
    project?: any
    goal_id?: string | null
}

const OutcomeShow = (
    {
        goal_id,
        project,
        outcome_id,
        callBackFunction
    }: Props
) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`project_outcome/${outcome_id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [])

    const nodes: React.ReactNode[] = [
        <Output
            key={'outcome'}
            project_id={project?.id}
            outcome_id={outcome_id}
            selectedViewCard="output/show"
            callBackFunction={callBackFunction}
            isHideAdd={project?.status === 'closed'}
        />,
        <Indicator
            key={'outcome'}
            project_id={project?.id}
            from='outcome'
            from_id={outcome_id}
            means_of_verification={data.measurement_type_id}
        />,
        <Assignment
            project={project}
            key={'assignment'}
            from='outcome'
            from_id={outcome_id}
        />,
        <AssumptionConstraint
            key={'assumption'}
            from_id={outcome_id}
            from="outcome"
            project_id={project?.id}
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
                                    { label: 'Outcome Name', value: data?.name },
                                    { label: 'Project ', value: data?.project },
                                    { label: 'Start Date', value: data.start_date },
                                    { label: 'End Date', value: data.end_date },
                                    { label: 'Progress (%)', value: statusFormatter(data.progress) },
                                    { label: 'Direct Cost Budget', value: <FormattedMoney amount={data.cost} /> },
                                    { label: 'Resource Cost Budget', value: <FormattedMoney amount={data.resource_cost} /> },
                                    { label: 'Total Cost Budget', value: <FormattedMoney amount={data.total_cost} /> },]}
                                titleA="Project Outcome"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        {/* {Number(passedData?.status) === 1 && */}
                        <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "Outputs",
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

export default OutcomeShow;