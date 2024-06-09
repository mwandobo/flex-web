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
import MuiReportTable from "@/components/tables/mui-report-table";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


const EvaluationReportShow = ({ params }: { params: { reportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [payload, setPayload] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isCollecting, setIsCollecting] = useState(false)
    const [formPayload, setFormPayload] = useState<any>()
    const token = getValueFromLocalStorage('token')
    const { state, dispatch } = useGlobalContextHook()
    const { selectedMonitoringItem } = state;
    const { selected, expandedItem } = selectedMonitoringItem
    const id = params.reportId


    const url = `project_evaluation_report/show_single/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                setLoading(true)
                const res = await get(url, token)

                if (res.status === 200) {
                    console.log(res)
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
            id: 'for',
            numeric: false,
            hasUrl: true,
            disablePadding: false,
            label: 'Evaluation For',
        },
        {
            id: 'for_name',
            numeric: false,
            disablePadding: false,
            label: 'Item Name',
        },
        {
            id: 'indicator',
            numeric: false,
            disablePadding: false,
            label: 'Indicator Name',
        },
        {

            id: 'baseline_data',
            numeric: false,
            disablePadding: false,
            label: 'Baseline Data',
        },
        {
            id: 'target_data',
            numeric: false,
            disablePadding: false,
            label: 'Target Data',
        },
        {
            id: 'evaluation_data',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Data',
        },
    ]

    const handleClick = (type: string, payload?: any) => {
        if (type.toLowerCase() === 'view') {
            return router.push(`/report/evaluation-report/${id}/show/${payload.id}`)
        }
    }


    const createRow = (input: any,) => {
        let row: any;
        row = [
            input.for,
            input.for_name,
            input.indicator,
            input.baseline_data,
            input.target_data,
            input.evaluation_data,
        ]

        return row
    }

    const customTableFunction = () => {
        let payload: any[] = []

        console.log(data)

        data?.evaluation_data?.forEach((item: any) => {
            const row = createRow(item)
            payload.push(row)
        })

        return payload
    }

    const handleHeadeClick = () => {
        const doc = new jsPDF();

        // Customize the document title, font, etc.
        doc.setFontSize(11);
        doc.text(`Project: ${data.project_name} Evaluation Report`, 14, 22);

        // Add a table with the data
        autoTable(doc, {
            startY: 30,
            head: [['SN', 'Evaluation For', 'Item Name', 'Indicator Name', 'Baseline Data', 'Target Data', 'Evaluation Data']],
            body: data.evaluation_data.map((item, index) => [index + 1, item.for, item.for_name, item.indicator, item.baseline_data, item.target_data, item.evaluation_data]),
        });

        // Save the generated PDF
        doc.save(`${data?.project_name?.trim()}_evaluation_report.pdf`);
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
                            isDownload={true}
                            handleClick={handleHeadeClick}
                        />
                        <div className="bg-white px-2 ">
                            <MuiReportTable
                                data={customTableFunction()}
                                columns={columns}
                                from="monitoring"
                            />
                        </div>
                    </div>
            }
        </ProtectedRoute>
    );
};

export default EvaluationReportShow;