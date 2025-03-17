"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { baseURL, get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import NoDataComponent from "@/components/status/no-data";
import { capitalizeFirstWord } from "@/utils/actions/string-manipulations";
import FormattedMoney from "@/components/moneyFormater";
import GeneratePdf from "@/components/pdf/generate-pdf";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import {statusFormatter} from "@/utils/actions/status-formatter";
import MuiTab from "@/components/tabs/mui-tab";

const EvaluationReportShow = ({ params }: { params: { timesheetActivityId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const id = params.timesheetActivityId

    const url = `timesheet/show-single/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                setLoading(true)
                const res = await get(url)

                if (res.status === 200) {
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
    }, [id])



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
                                    { label: 'Activity Name', value: data?.formatted_name },
                                    { label: 'Output Name', value: data?.output_name },
                                    { label: 'Outcome Name', value: data?.outcome_name },
                                    { label: 'Goal Name', value: data?.goal_name },
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
                    </>
            }
        </ProtectedRoute>

    );
};

export default EvaluationReportShow;