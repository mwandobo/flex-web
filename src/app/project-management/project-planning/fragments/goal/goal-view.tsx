"use client"

import Indicator from "@/app/project-management/fragments/indicator";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Outcome from "../outcome/outcome";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { statusFormatter } from "@/utils/actions/status-formatter";
import FormattedMoney from "@/components/moneyFormater";
import Assumption from "@/app/project-management/fragments/assumption";

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    goal_id?: string
    project_id?: string | null
    selectedViewCard?: string
}

const GoalShow = (
    {
        project_id,
        goal_id,
        callBackFunction

    }: Props
) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const token = getValueFromLocalStorage('token')

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`project_goal/${project_id}/show/${goal_id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [])


    const nodes: React.ReactNode[] = [
        <Outcome
            key={'outcome'}
            project_id={project_id}
            goal_id={goal_id}
            selectedViewCard="outcome/show"
            callBackFunction={callBackFunction}
        />,
        <Indicator
            key={'outcome'}
            project_id={project_id}
            from='goal'
            from_id={goal_id}
            means_of_verification={data.measurement_type_id}
        />,
        <Assumption
            key={'assumption'}
            from_id={goal_id}
            from="goal"
            project_id={project_id}
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
                                    { label: 'Goal Name', value: data?.name },
                                    { label: 'Project ', value: data?.project },
                                    { label: 'Start Date', value: data.start_date },
                                    { label: 'End Date', value: data.end_date },
                                    { label: 'Status', value: statusFormatter(data.progress_status) },
                                    { label: 'Direct Cost Budget', value: <FormattedMoney amount={data.cost} /> },
                                    { label: 'Resource Cost Budget', value: <FormattedMoney amount={data.resource_cost} /> },
                                    { label: 'Total Cost Budget', value: <FormattedMoney amount={data.total_cost} /> },
                                ]}
                                titleA="Project Goal"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        {/* {Number(passedData?.status) === 1 && */}
                        <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "Outcomes",
                                    "Indicators",

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

export default GoalShow;