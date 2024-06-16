"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LinearWithValueLabel from "@/components/bars/progressBar";
import CircularWithValueLabel from "@/components/bars/circularBar";
import { getValueFromLocalStorage, setValueLocalStorage } from "@/utils/actions/local-starage";
import { Activity, ChevronDown, ChevronUp, CircleCheckBig, ClipboardCheck } from "lucide-react";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import MuiTable from "@/components/tables/mui-table";
import CrudButtonsComponent from "@/components/crud-operator-buttons";

const EvaluationReportShow = ({ params }: { params: { learningReportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [payload, setPayload] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const token = getValueFromLocalStorage('token')
    const { state, dispatch } = useGlobalContextHook()
    const { selectedMonitoringItem } = state;
    const { selected, expandedItem } = selectedMonitoringItem
    const id = params.learningReportId

    const url = `project_learning_report/show/${id}`
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
    }, [id, token, isSubmitted])

    const columns = [
        {
            id: 'formaated_code',
            numeric: false,
            hasUrl: true,
            disablePadding: false,
            label: 'Evaluation Code',
            width: '30%',
        },
        {
            id: 'project_name',
            numeric: false,
            disablePadding: false,
            label: 'Project Name',
            width: '65%',
        },
        {
            id: 'actions',
            numeric: false,
            disablePadding: false,
            label: 'Actions',
            width: '65%',
        },
    ]

    const handleClick = (type: string, payload?: any) => {
        if (type.toLowerCase() === 'show') {
            return router.push(`/report/learning-report/${id}/show/${payload.id}`)
        }
    }

    const createRow = (input: any,) => {
        let row: any;
        row = [
            input.formatted_code,
            input.project_name,
            <CrudButtonsComponent
                key={input.id + 'cr'}
                hide_approve={true}
                hide_edit={true}
                hide_delete={true}
                handleClick={handleClick}
                input={input}
            />
        ]

        return row
    }

    const customTableFunction = () => {
        let payload: any[] = []

        data.forEach((item: any) => {
            const row = createRow(item)
            payload.push(row)
        })

        return payload
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col">
                        <PageHeader
                            links={[
                                { name: 'Project Evaluation Report', linkTo: '/report/evaluation-report', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <div className="bg-white ">
                            <MuiTable
                                data={customTableFunction()}
                                columns={columns}
                            />
                        </div>
                    </div>
            }
        </ProtectedRoute>
    );
};

export default EvaluationReportShow;