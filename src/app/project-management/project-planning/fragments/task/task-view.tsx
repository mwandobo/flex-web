"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get, put } from "@/utils/api";
import { useEffect, useState } from "react";
import Resource from "@/app/project-management/fragments/resource";
import Cost from "@/app/project-management/fragments/costs";
import Deliverable from "@/app/project-management/fragments/deliverable";
import Assumption from "@/app/project-management/fragments/assumption";
import Risk from "@/app/project-management/fragments/risk";
import Assignment from "@/app/project-management/fragments/assignment";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import FileUploadForm from "@/app/project-management/fragments/document";
import ProgressStatus from "@/components/status/progress";
import FormattedMoney from "@/components/moneyFormater";

interface Props {
    callBackFunction?: (selectedCard: string) => void
    project_id?: string | null
    project?: any
    task_id?: string | null
    activity_id?: string
}

const TaskShow = (
    {
        project_id,
        project,
        activity_id,
        task_id,
    }: Props
) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')


    const handleProgressStatus = (key: string) => {
        let keyName: string;

        switch (key) {
            case 'created':
                keyName = 'start';
                break;
            case 'start':
                keyName = 'complete';
                break;
            default: break;
        }

        return keyName
    }

    const handleExtraButtonOnClick = async (key?: string) => {
        setLoading(true)

        const formData = {
            status: handleProgressStatus(key)
        }

        const res = await put(`project_task/${project_id}/${activity_id}/progress/${task_id}`, formData, token)

        if (res && res.status === 200) {
            setRefresh(!refresh)
            setLoading(false)
        }
    }

    const handleExtraButtonName = () => {
        let name = data.progress_status;

        let butName: string;
        switch (name) {
            case 'created':
                butName = 'Start Task';
                break;
            case 'start':
                butName = 'Finish Task';
                break;
            case 'complete':
                butName = 'Task Completed';
                break;
            default: break;

        }

        return butName
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`project_task/${project_id}/${activity_id}/show/${task_id}`, token)
            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [refresh])

    console.log(data)

    // const nodes: React.ReactNode[] = [
    //     <Assignment
    //         project={project}
    //         key={'assignment'}
    //         task_id={task_id}
    //     />,
    //     <Resource
    //         key={'resource'}
    //         task_id={task_id}
    //         project_id={project_id}
    //     />,
    //     <Cost
    //         key={'cost'}
    //         task_id={task_id}
    //         project_id={project_id}
    //     />,
    //     <Deliverable
    //         key={'delivareble'}

    //         task_id={task_id}
    //         project_id={project_id}
    //     />,
    //     <Assumption
    //         key={'assumption'}
    //         task_id={task_id}
    //         project_id={project_id}
    //     />,
    //     <Risk
    //         key={'risk'}
    //         task_id={task_id}
    //         project_id={project_id}
    //     />,
    //     <FileUploadForm
    //         key={'file'}
    //         task_id={task_id}
    //         project_id={project_id}
    //     />
    // ];

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
                                isExtraButton={true}
                                isExtraButtonDisabled={data.progess_status === 'complete' ? true : false}
                                buttonName={handleExtraButtonName()}
                                buttonAction={"start"}
                                buttonKey={data.progress_status}

                                onClick={handleExtraButtonOnClick}
                                data={[
                                    { label: 'Code', value: data.formatted_code },
                                    { label: 'Task Name', value: data?.name },
                                    { label: 'Project ', value: data?.project },
                                    { label: 'Start Date', value: data.start_date },
                                    { label: 'End Date', value: data.end_date },
                                    { label: 'Status', value: <ProgressStatus status={data.progress_status} /> },
                                    { label: 'Direct Cost ', value: <FormattedMoney amount={data.cost} /> },
                                    { label: 'Resource Cost ', value: <FormattedMoney amount={data.resource_cost} /> },
                                    { label: 'Total Cost ', value: <FormattedMoney amount={data.total_cost} /> },
                                ]}
                                titleA="Project Tasks"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        {/* <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "Assignment",
                                    "Resource",
                                    "Costs",
                                    "Deliverables",
                                    "Assumptions",
                                    "Risks",
                                    "Documents"
                                ]}
                                nodes={nodes}
                            >
                            </MuiTab>
                        </MuiCardComponent> */}
                    </>
            }
        </ProtectedRoute>
    );
};

export default TaskShow;