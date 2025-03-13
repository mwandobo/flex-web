"use client"

import ExternalUsers from "@/app/admnistration/external/page";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import {get} from "@/utils/api";
import React, {useEffect, useState} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import Assumption from "../../fragments/assumption";
import Resource from "../../fragments/resource";
import Risk from "../../fragments/risk";
import {useRouter} from "next/navigation";
import FormattedMoney from "@/components/moneyFormater";
import OutcomeCost from "../../fragments/outcome-cost";
import LogFrameIndicator from "../../fragments/logframe-indicator";
import Purpose from "../../fragments/purpose";
import ApprovalComponent from "@/components/page-components/approval-component";
import {PROJECT_APPROVAL_SLUG} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2} from "lucide-react";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import Budget from "@/app/project-management/fragments/Budget";
import AssumptionConstraint from "@/app/project-management/fragments/assumption_constraint";

const ProjectShow = ({params}: { params: { projectId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.projectId
    const router = useRouter()

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: PROJECT_APPROVAL_SLUG,
        from: PROJECT_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => {
       if (data.status !== 'pending') return true;
       return (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))
    }

    const url = `project/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await get(url, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        } catch (error: any) {
            if (error?.code === "ERR_NETWORK") {
                navigateToLogin()
            }
        }
    };
    useEffect(() => {
        fetchData()
    }, [refresh])


    const onSave = async () => {
        try {
            const res = await get(`${url}/close`, token);
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Close Project: ${data?.name}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const nodes: React.ReactNode[] = [
        <LogFrameIndicator
            key={'logframe'}
            project={data}
        />,
        <Purpose
            key={'purpose'}
            project={data}
            isHideAdd={true}
        />,
        <ExternalUsers
            key={'sponsor'}
            groupProp="sponsor"
            project={data}
            project_id={id}
            isHideShow={true}
            isHideAdd={data?.status === 'closed'}
        />,
        <ExternalUsers
            key={'stakeholder'}
            groupProp="stakeholder"
            project_id={id}
            project={data}
            isHideShow={true}
            isHideAdd={data?.status === 'closed'}
        />,
        <Budget
            key={'cost'}
            project={data}
            isHideAdd={true}
            prefix="Budget"
        />,
        <OutcomeCost
            key={'cost'}
            outcomes={data.outcomes}
            project={data}
            isHideAdd={true}
        />,
        <Risk
            key={'risk'}
            project_id={id}
            isHideAdd={true}
        />,
        <AssumptionConstraint
            key={'assumption'}
            from={'project'}
            from_id={id}
            project={data}
            isHideAdd={data?.status === 'closed'}
        />,
        <Resource
            key={'resource'}
            project_id={id}
            isHideAdd={true}
        />,
        <ApprovalComponent
            key={'approved'}
            project_id={id}
            from={PROJECT_APPROVAL_SLUG}
            from_id={id}
            isHideAdd={true}
        />,
    ];

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Close Project'}
                    onClick={() => handleSubmit()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <CheckCircle2 size={13}/>
                </ReusableButton>
            }
        </>
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {name: 'Project', linkTo: '/projects', permission: 'projects', isClickable: true},
                                {name: 'Show', linkTo: '/', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Code', value: data?.code},
                                    {label: 'Project Name', value: data?.name},
                                    {label: 'Project Location', value: data?.location},
                                    {label: 'Project Owner', value: data?.owner},
                                    {label: 'Start Date', value: data.formatted_start_date},
                                    {label: 'End Date', value: data.formatted_end_date},
                                    {
                                        label: 'Total Direct Cost',
                                        value: <FormattedMoney amount={data.total_direct_cost}/>
                                    },
                                    {
                                        label: 'Total Resource Cost',
                                        value: <FormattedMoney amount={data.total_resource_cost}/>
                                    },
                                    {
                                        label: 'Grand Total Cost',
                                        value: <FormattedMoney amount={data.grand_total_cost}/>
                                    },
                                    {label: 'Prepared By', value: data?.prepared_by},
                                    {label: 'Description', value: data?.description},
                                    {label: 'Summary', value: data?.summary},
                                    {label: 'Scope', value: data?.scope},
                                    {label: 'Purpose', value: data?.purpose},
                                    {label: 'Progress', value: data.progress_status},
                                    {label: 'Status', value: data.status},

                                ]}
                                titleA="Project"
                                titleB={data?.name}
                                OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                            />
                        </MuiCardComponent>
                        <MuiCardComponent>
                            <MuiTab
                                columns={
                                    approveStatus() ?
                                        [
                                            "LogFrame",
                                            "Purpose",
                                            "Sponsors",
                                            "Stakeholders",
                                            "Budget",
                                            "Cost",
                                            "Risks",
                                            "Assumptions & constraints",
                                            "Resources",
                                            "Approvals"
                                        ]
                                        : ["Approvals"] // Show only "Approvals" column when the condition is false
                                }
                                nodes={
                                    approveStatus() ?
                                        nodes // Show all nodes when condition is true
                                        : [nodes[nodes.length - 1]] // Only show the last node (Approvals node) when condition is false
                                }
                            />
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ProjectShow;