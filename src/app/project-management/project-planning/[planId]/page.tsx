"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import PageHeader from "@/components/header/page-header";
import {get} from "@/utils/api";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Goal from "../fragments/goal/goal";
import GoalShow from "../fragments/goal/goal-view";
import Outcome from "../fragments/outcome/outcome";
import OutcomeShow from "../fragments/outcome/outcome-view";
import Output from "../fragments/output/output";
import Activity from "../fragments/activity/activity";
import OutputShow from "../fragments/output/output-view";
import ActivityShow from "../fragments/activity/activity-view";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

const ProjectPlanningShow = ({params}: { params: { planId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const {state, dispatch} = useGlobalContextHook()
    const selected = state.planningItem.from
    const selectedId = state.planningItem.id

    const token = getValueFromLocalStorage('token')

    const id = params.planId
    const url = `project_planning/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const items = [
        {title: 'Goal', routes: ['goal', 'goal/show'], click: 'goal', length: data.goals?.length},
        {title: 'Outcome', routes: ['outcome', 'outcome/show'], click: 'outcome', length: data.outcomes?.length},
        {title: 'Output', routes: ['output', 'output/show'], click: 'output', length: data.outputs?.length},
        {title: 'Activity', routes: ['activity', 'activity/show'], click: 'activity', length: data.activities?.length},
    ]

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


    const handleCardClick = (cardName: string, id?: string) => {
        if (cardName) {
            dispatch({type: 'SET_PLANNING_ITEM', payload: {id, from: cardName}})
        }
    }

    useEffect(() => {
        // Retrieve values from local storage
        const selected_plan_item = getValueFromLocalStorage('planningItem');
        if(selected_plan_item){
            dispatch({type: 'SET_PLANNING_ITEM', payload: JSON.parse(selected_plan_item)})
        }
    }, []);

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {name: 'Project Planning', linkTo: '/projects', permission: ''},
                                {name: 'Show', linkTo: '/projects/show', permission: ''},
                            ]}
                            isShowPage={true}
                            showrefresh={true}
                        />
                        <MuiCardComponent
                        >
                            <div className={`mt-3 p-5`}>
                                <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-3 items-center">
                                    {items.map((item, index) =>
                                        <div
                                            key={index}
                                            className={` ${item.routes.includes(selected) ? 'bg-gray-500 text-white text-2xl font-bold ' : 'bg-gray-300 '} w-full h-32 hover:h-36 flex flex-col justify-center items-center cursor-pointer rounded-sm shadow-md`}
                                            onClick={() => handleCardClick(item.click)}
                                        >
                                            <h3>{item.title}</h3>
                                            <p>{item.length}</p>
                                        </div>)
                                    }
                                </div>
                                <div className={`mt-3 p-2`}>
                                    {selected === 'goal' &&
                                        <Goal
                                            project={data?.project}
                                            isHideAdd={data?.project?.status === 'closed'}
                                            callBackFunction={handleCardClick}
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