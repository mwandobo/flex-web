"use client"

import ExternalUsers from "@/app/admnistration/external/page";
import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import MuiTab from "@/components/tabs/mui-tab";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import Indicator from "../../fragments/indicator";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import Assumption from "../../fragments/assumption";
import Cost from "../../fragments/costs";
import Resource from "../../fragments/resource";
import Risk from "../../fragments/risk";
import { useRouter } from "next/navigation";
import FormattedMoney from "@/components/moneyFormater";
import LogFrame from "../../fragments/logframe";
import Budget from "../../fragments/budget";
import OutcomeCost from "../../fragments/outcome-cost";
import LogFrameIndicator from "../../fragments/logframe-indicator";

const ProjectShow = ({ params }: { params: { projectId: string } }) => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.projectId
    const router = useRouter()

    const url = `department/show/${id}`
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

            setLoading(true)
            const res = await get(`project/show/${id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [id, token])


    const nodes: React.ReactNode[] = [
        <LogFrameIndicator
            key={'logframe'}
            project={data}
        />,

        <ExternalUsers
            key={'sponsor'}
            groupProp="sponsor"
            project={data}
            project_id={id}
            isHideShow={true}
        />,

        <ExternalUsers
            key={'stakeholder'}
            groupProp="stakeholder"
            project_id={id}
            project={data}
            isHideShow={true}
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
        <Assumption
            key={'assumption'}
            from={'project'}
            from_id={id}
            project_id={id}
            isHideAdd={false}
        />,
        <Resource
            key={'resource'}
            project_id={id}
            isHideAdd={true}
        />,
        // <Deliverable
        //     key={'deliverable'}
        //     project_id={id}
        //     isHideAdd={true}
        // />
    ];

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader

                            links={[
                                { name: 'Project', linkTo: '/projects', permission: 'projects', isClickable: true },
                                { name: 'Show', linkTo: '/', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    { label: 'Code', value: data?.code },
                                    { label: 'Project Name', value: data?.name },
                                    { label: 'Project Location', value: data?.location },
                                    { label: 'Project Owner', value: data?.owner },
                                    { label: 'Start Date', value: data.formatted_start_date },
                                    { label: 'End Date', value: data.formatted_end_date },
                                    { label: 'Total Direct Cost', value: <FormattedMoney amount={data.total_direct_cost} /> },
                                    { label: 'Total Resource Cost', value: <FormattedMoney amount={data.total_resource_cost} /> },
                                    { label: 'Grand Total Cost', value: <FormattedMoney amount={data.grand_total_cost} /> },
                                    { label: 'Prepared By', value: data?.prepared_by },
                                    { label: 'Description', value: data?.description },
                                    { label: 'Progress', value: data.progress_status },
                                ]}
                                titleA="Project"
                                titleB={data?.name}
                            />
                        </MuiCardComponent>
                        <MuiCardComponent>
                            <MuiTab
                                columns={[
                                    "LogFrame",
                                    "Sponsors",
                                    "Stakeholders",
                                    "Budget",
                                    "Cost",
                                    "Risks",
                                    "Assumptions & constraints"
                                    // "Deliverable"
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

export default ProjectShow;