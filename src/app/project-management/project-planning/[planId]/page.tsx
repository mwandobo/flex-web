"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import PageHeader from "@/components/header/page-header";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Goal from "../fragments/goal/goal";
import GoalShow from "../fragments/goal/goal-view";
import Outcome from "../fragments/outcome/outcome";
import OutcomeShow from "../fragments/outcome/outcome-view";
import Output from "../fragments/output/output";
import Activity from "../fragments/activity/activity";
import OutputShow from "../fragments/output/output-view";
import ActivityShow from "../fragments/activity/activity-view";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";

const ProjectPlanningShow = ({ params }: { params: { planId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState('')
    const [selectedId, setSelectedId] = useState<any>('')

    const token = getValueFromLocalStorage('token')
    const { state, dispatch } = useGlobalContextHook()

    const id = params.planId
    const { planningCount } = state;

    const url = `project_planning/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
                }
            }
        };
        fetchData()
    }, [])

    useEffect(() => {
        dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: data.goals?.length, for: "goals" } })
        dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: data.outcomes?.length, for: "outcomes" } })
        dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: data.outputs?.length, for: "outputs" } })
        dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: data.activities?.length, for: "activities" } })
        dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: data.tasks?.length, for: "tasks" } })
    }, [data])

    const handleCardClick = (cardName: string, id?: string) => {
        setSelected(cardName)
        setSelectedId(id)
        setValueLocalStorage('selected_plan_item', cardName )
        setValueLocalStorage('selected_plan_item_id', id )
    }

    useEffect(() => {
        const selected_plan_item = getValueFromLocalStorage('selected_plan_item');
        const selected_plan_item_id = getValueFromLocalStorage('selected_plan_item_id');
        setSelected(selected_plan_item)
        setSelectedId(selected_plan_item_id)
    }, [])

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                { name: 'Project Planning', linkTo: '/projects', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                            showrefresh={true}
                        />
                        <MuiCardComponent
                        >
                            <div className={`mt-3 p-5`}>
                                <div className="flex gap-3 items-center">
                                    <div
                                        className={` ${['goal', 'goal/show'].includes(selected) ? 'bg-gray-500 text-white text-2xl font-bold w-2/6 h-40 hover:h-40' : 'bg-gray-300  w-1/4 h-32 hover:h-40'}  flex flex-col justify-center items-center cursor-pointer rounded-sm shadow-md`}
                                        onClick={() => handleCardClick('goal')}
                                    >
                                        <h3>Goals</h3>
                                        <p>{planningCount?.goals}</p>
                                    </div>
                                    <div
                                        className={` ${['outcome', 'outcome/show'].includes(selected) ? 'bg-gray-500 text-white text-2xl font-bold w-2/6 h-40 hover:h-40' : 'bg-gray-300  w-1/4 h-32 hover:h-40'}  flex flex-col justify-center items-center cursor-pointer rounded-sm shadow-md`}
                                        onClick={() => handleCardClick('outcome')}
                                    >
                                        <h3>Outcomes</h3>
                                        <p>{planningCount?.outcomes}</p>
                                    </div>
                                    <div
                                        className={` ${['output', 'output/show'].includes(selected) ? 'bg-gray-500 text-white text-2xl font-bold w-2/6 h-40 hover:h-40' : 'bg-gray-300  w-1/4 h-32 hover:h-40'}  flex flex-col justify-center items-center cursor-pointer rounded-sm shadow-md`}
                                        onClick={() => handleCardClick('output')}
                                    >
                                        <h3>Outputs</h3>
                                        <p>{planningCount?.outputs}</p>
                                    </div>
                                    <div
                                        className={` ${['activity', 'activity/show'].includes(selected) ? 'bg-gray-500 text-white text-2xl font-bold w-2/6 h-40 hover:h-40' : 'bg-gray-300  w-1/4 h-32 hover:h-40'}  flex flex-col justify-center items-center cursor-pointer rounded-sm shadow-md`}
                                        onClick={() => handleCardClick('activity')}
                                    >
                                        <h3>Activities</h3>
                                        <p>{planningCount?.activities}</p>
                                    </div>

                                </div>
                                <div className={`mt-3 p-2`}>
                                    {selected === 'goal' &&
                                        <Goal
                                            project_id={data?.project?.id}
                                            callBackFunction={handleCardClick}
                                            selectedViewCard={'goal/show'}
                                        />}
                                    {selected === 'goal/show' &&
                                        < GoalShow
                                            goal_id={selectedId}
                                            project={data?.project}
                                            callBackFunction={handleCardClick}
                                        />
                                    }
                                    {selected === 'outcome' &&
                                        <Outcome
                                            project_id={data?.project?.id}
                                            callBackFunction={handleCardClick}
                                            goal_id={selectedId}
                                            selectedViewCard={'outcome/show'}
                                            isHideAdd={true}
                                        />
                                    }

                                    {selected === 'outcome/show' && <OutcomeShow
                                        project={data?.project}
                                        callBackFunction={handleCardClick}
                                        goal_id='undefined'
                                        outcome_id={selectedId}
                                    />}
                                    {selected === 'output' &&
                                        <Output
                                            project={data.data}
                                            project_id={data?.project?.id}
                                            callBackFunction={handleCardClick}
                                            outcome_id={selectedId}
                                            selectedViewCard={'output/show'}
                                            isHideAdd={true}
                                        />
                                    }

                                    {selected === 'output/show' && <OutputShow
                                        project_id={data?.project?.id}
                                        project={data.project}
                                        callBackFunction={handleCardClick}
                                        outcome_id='undefined'
                                        output_id={selectedId}
                                    />}

                                    {selected === 'activity' &&
                                        <Activity
                                            project={data}
                                            project_id={data?.project?.id}
                                            callBackFunction={handleCardClick}
                                            output_id={selectedId}
                                            selectedViewCard={'activity/show'}
                                            isHideAdd={true}

                                        />
                                    }

                                    {selected === 'activity/show' && <ActivityShow
                                        project={data.project}
                                        project_id={data?.project?.id}
                                        callBackFunction={handleCardClick}
                                        output_id="undefined"
                                        activity_id={selectedId}
                                    />
                                    }
                                </div>
                            </div>

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ProjectPlanningShow;