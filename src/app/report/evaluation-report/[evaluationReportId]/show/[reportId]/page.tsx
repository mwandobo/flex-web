"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import MuiReportTable from "@/components/tables/mui-report-table";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import NoDataComponent from "@/components/status/no-data";
import FormattedMoney from "@/components/moneyFormater";

const EvaluationReportShow = ({ params }: { params: { reportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [evaluatedItem, setEvaluatedItem] = useState('')
    const token = getValueFromLocalStorage('token')
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

    const costColumns = [
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
            id: 'Budget',
            numeric: false,
            disablePadding: false,
            label: 'budget',
        },
        {
            id: 'expense',
            numeric: false,
            disablePadding: false,
            label: 'Expense',
        },
        {
            id: 'evaluated_expense',
            numeric: false,
            disablePadding: false,
            label: 'Evaluated Expense',
        },
        {
            id: 'evaluation',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Mark',
        },
    ]

    const combinedColumns = [
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
            id: 'Budget',
            numeric: false,
            disablePadding: false,
            label: 'budget',
        },
        {
            id: 'expense',
            numeric: false,
            disablePadding: false,
            label: 'Expense',
        },
        {
            id: 'evaluated_expense',
            numeric: false,
            disablePadding: false,
            label: 'Evaluated Expense',
        },
        {
            id: 'evaluation',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Mark',
        },
    ]

    const createRow = (input: any) => {
        let row: any;

        switch (evaluatedItem) {
            case "indicator":

                row = [
                    input.for,
                    input.for_name,
                    input.indicator,
                    input.baseline_data,
                    input.target_data,
                    input.evaluation_data,
                ]; break;
            case "input":
                row = [
                    input.for,
                    input.code + ' - ' + input.name,
                    FormattedMoney({ amount: input.cost }),
                    FormattedMoney({ amount: input.occured_cost }),
                    FormattedMoney({ amount: input.evaluated_cost }),
                    input.evaluation,
                ]; break;
            case "combined":
                row = [
                    input.for,
                    input.code, + '-' + input.name,
                    input.indicator,
                    input.baseline_data,
                    input.target_data,
                    input.evaluation_data,
                ]; break;
        }
        return row
    }

    const _columns = () => {
        switch (evaluatedItem) {
            case 'indicator':
                return columns
            case 'input':
                return costColumns
            case 'combined':
                return combinedColumns
        }
    }

    const reportHeader = () => {
        console.log(evaluatedItem)
        switch (evaluatedItem) {
            case 'indicator': return "Indicators Project Evaluation";
            case 'input': return "Inputs Project Evaluation"
            case 'combined': return "Combined Report Project Evaluation"
            default: break
        }
    }

    const customTableFunction = () => {
        let payload: any[] = []
        let someData: any[] = []

        switch (evaluatedItem) {
            case 'indicator': someData = data?.indicator_evaluation?.evaluation_data; break
            case 'input': someData = data?.input_evaluation?.evaluation_data; break
            case 'combined': someData = data?.combined_evaluation?.evaluation_data; break
            default: break
        }

        if (someData.length > 0) {
            someData.forEach((item: any) => {
                const row = createRow(item)
                console.log(item)
                payload.push(row)
            })
        }

        return payload
    }

    const handleHeadeClick = () => {
        const doc = new jsPDF();

        doc.setFontSize(11);
        doc.text(`Project: ${data.project_name} Evaluation Report`, 14, 22);

        autoTable(doc, {
            startY: 30,
            head: [['SN', 'Evaluation For', 'Item Name', 'Indicator Name', 'Baseline Data', 'Target Data', 'Evaluation Data']],
            body: data.evaluation_data.map((item, index) => [index + 1, item.for, item.for_name, item.indicator, item.baseline_data, item.target_data, item.evaluation_data]),
        });

        doc.save(`${data?.project_name?.trim()}_evaluation_report.pdf`);
    }

    const handleMonitoringItemChange = (item: string) => {
        setEvaluatedItem(item)
    }

    const evaluationsItems = [
        {
            name: "Indicators",
            from: "indicator"
        },
        {
            name: "Inputs",
            from: "input"
        }, {
            name: "Combined Report",
            from: "combined"
        }
    ]

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


                        <div className="bg-white h-full ">
                            <div className="flex ">
                                <div className="flex flex-col w-36 mt-4 ml-4 p-2">
                                    <h4 className="text-sm font-semibold mb-2">Evaluation Items</h4>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex flex-col ml-3 text-xs gap-1 cursor-pointer py-5">
                                            {
                                                evaluationsItems.map((item, index) =>
                                                    <p
                                                        key={index}
                                                        className={`p-1  hover:bg-sidebar-background hover:text-sidebar-active ${evaluatedItem === item.from && 'bg-sidebar-background text-sidebar-active'} `}
                                                        onClick={() => handleMonitoringItemChange(item.from)}>
                                                        {item.name}
                                                    </p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col p-4 h-full w-full bg-white">

                                    <div className="bg-white px-2 ">
                                        <h3 className="text-center"> {reportHeader()} </h3>
                                        {
                                            customTableFunction().length > 0 ?
                                                < MuiReportTable
                                                    data={customTableFunction()}
                                                    columns={_columns()}
                                                    from="monitoring"
                                                /> : <NoDataComponent />
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </ProtectedRoute>
    );
};

export default EvaluationReportShow;