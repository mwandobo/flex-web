"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import NoDataComponent from "@/components/status/no-data";
import { capitalizeFirstWord } from "@/utils/actions/string-manipulations";

const EvaluationReportShow = ({ params }: { params: { reportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [evaluatedItem, setEvaluatedItem] = useState('goal')
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
            id: 'for_name',
            numeric: false,
            disablePadding: false,
            label: `${capitalizeFirstWord(evaluatedItem)} Name`,
        },
        {
            id: 'start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        },
        {
            id: 'indicator',
            numeric: false,
            disablePadding: false,
            label: 'Indicator Name',
        },
        {
            id: 'evaluation_date',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Date',
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
        {
            id: 'evaluation_target',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Target',
        },
        {
            id: 'evaluation_time',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Time',
        },
    ]


    const costColumns = [
        {
            id: 'for',
            numeric: false,
            hasUrl: true,
            disablePadding: false,
            label: `${capitalizeFirstWord(evaluatedItem)} Name`,
        },
        {
            id: 'start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        },
        {
            id: 'evaluation_date',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Date',
        },
        {
            id: 'Budget',
            numeric: false,
            disablePadding: false,
            label: 'Budget',
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
            id: 'evaluation_target',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Target',
        },
        {
            id: 'evaluation_time',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Time',
        },
    ]

    const styler = (progress: string) => {
        console.log(progress)
        if (progress) {
            switch (true) {
                case (progress === 'fail'):
                    return 'bg-red-400';
                case (progress === "equal"):
                    return 'bg-yellow-400';
                case (progress === 'pass'):
                    return 'bg-green-400';
                default:
                    return ''
            }
        }
    }

    const reportHeader = () => {
        switch (evaluatedItem) {
            case 'goal': return "Indicators Evaluation";
            case 'outcome': return "Indicators Evaluation"
            default: break
        }
    }

    const customTableFunction = () => {
        switch (evaluatedItem) {
            case 'goal': return { data: data?.goals, inputs_data: data?.goal_inputs }
            case 'outcome': return { data: data?.outcomes, inputs_data: data?.outcome_inputs }
            default: break
        }
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
            name: "Goals",
            from: "goal"
        },
        {
            name: "Outcomes",
            from: "outcome"
        },
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
                                        <h3 className="text-left font-semibold mb-1"> {reportHeader()} </h3>
                                        {
                                            customTableFunction()?.data?.length > 0 ?
                                                <div>
                                                    <div className="grid grid-cols-10 border border-gray-500  bg-gray-200 ">
                                                        {columns.map((item, index) => {
                                                            const isLast = index === columns.length - 1;
                                                            return (

                                                                <div key={index} className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''}  border-gray-500 pl-1`}>
                                                                    <p className="text-xs ">
                                                                        {item.label}
                                                                    </p>
                                                                </div>
                                                            )
                                                        }
                                                        )}
                                                    </div>
                                                    <div className="border-b border-gray-500">
                                                        {customTableFunction()?.data?.map((item1, index) => {
                                                            const isFirst = index === 0;
                                                            return (
                                                                < >
                                                                    <div key={index} className={`grid grid-cols-10 ${!isFirst ? 'border-t' : ''} border-b border-r border-l border-gray-500`}>
                                                                        <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1" >
                                                                            <p className="text-xs ">
                                                                                {item1.name}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                            <p className="text-xs ">
                                                                                {item1.start_date}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                            <p className="text-xs ">
                                                                                {item1.end_date}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col col-span-5 justify-center items-start p-1 border-r border-gray-500 " >
                                                                            <p className="text-sm font-semibold ">
                                                                                Indicators
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                            <p className="text-xs ">
                                                                                {item1.evaluation_target}
                                                                            </p>
                                                                        </div>
                                                                        <div className={`flex flex-col ${styler(item1.evaluation_time)}  justify-center items-center border-r p-1`}>
                                                                            <p className="text-xs ">
                                                                                {item1.evaluation_time}
                                                                            </p>
                                                                        </div>

                                                                    </div>
                                                                    <>
                                                                        {item1?.indicators.map((item2, index) => {
                                                                            const isLast = index === item1?.indicators.length - 1;
                                                                            return (
                                                                                <div key={index} className={`grid grid-cols-10 border-r border-l border-gray-500`}>
                                                                                    <div className="flex flex-col col-span-3 justify-center items-center border-r border-gray-500 p-1">
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p className="text-xs ">
                                                                                            {item2.indicator}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p className="text-xs ">
                                                                                            {item2.evaluation_date}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p className="text-xs ">
                                                                                            {item2.baseline_data}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p className="text-xs ">
                                                                                            {item2.target_data}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p className="text-xs ">
                                                                                            {item2.evaluation_data}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                                                                                            {item2.evaluation_target}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className={`flex flex-col justify-center items-center p-1 ${styler(item2.evaluation_time)} ${!isLast ? 'border-b' : ''}`}>
                                                                                        <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                                                                                            {item2.evaluation_time}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </>
                                                                </>
                                                            )
                                                        }
                                                        )}
                                                    </div>
                                                    <div className="bg-white w-4/5 mt-5 ">
                                                        <h3 className="text-start font-semibold mb-1"> Inputs Evaluation </h3>
                                                        {
                                                            customTableFunction()?.inputs_data?.length > 0 ?
                                                                <div>
                                                                    <div className="grid grid-cols-9 border border-gray-500  bg-gray-200 ">
                                                                        {costColumns.map((item, index) => {
                                                                            const isLast = index === costColumns.length - 1;
                                                                            return (
                                                                                <div key={index} className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''} border-gray-500 pl-1`}>
                                                                                    <p className="text-xs ">
                                                                                        {item.label}
                                                                                    </p>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        )}
                                                                    </div>
                                                                    {customTableFunction()?.inputs_data?.map((item2, index) =>
                                                                        <div key={index} className="grid grid-cols-9  border-b border-r border-l border-gray-500">
                                                                            <>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.for_name}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.start_date}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.end_date}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.evaluation_date}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.budget}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.occured_cost}
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                                                                                    <p className="text-xs ">
                                                                                        {item2.cost}
                                                                                    </p>
                                                                                </div>
                                                                                <div className={`flex flex-col justify-center items-center  border-r border-gray-500 p-1`}>
                                                                                    <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                                                                                        {item2.evaluation_target}
                                                                                    </p>
                                                                                </div>
                                                                                <div className={`flex flex-col justify-center items-center  border-gray-500 p-1 ${styler(item2.evaluation_time)}`}>
                                                                                    <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                                                                                    </p>
                                                                                </div>
                                                                            </>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                : <NoDataComponent />
                                                        }
                                                    </div>
                                                </div>
                                                : <NoDataComponent />
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            }
        </ProtectedRoute >
    );
};

export default EvaluationReportShow;