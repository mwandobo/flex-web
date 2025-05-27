"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import {get} from "@/utils/api";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getValueFromLocalStorage,} from "@/utils/actions/local-starage";
import NoDataComponent from "@/components/status/no-data";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";
import FormattedMoney from "@/components/moneyFormater";
import GeneratePdf from "@/components/pdf/generate-pdf";

const EvaluationReportShow = ({params}: { params: { reportId: string } }) => {
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
            id: 'for_code',
            numeric: false,
            disablePadding: false,
            label: `${evaluatedItem !== "combined" ? capitalizeFirstWord(evaluatedItem) : ""} Code`,
        },
        {
            id: 'for_name',
            numeric: false,
            disablePadding: false,
            label: `${evaluatedItem !== "combined" ? capitalizeFirstWord(evaluatedItem) : ""} Name`,
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

    const indicatorColumns = [
        {
            id: 'code',
            numeric: false,
            disablePadding: false,
            label: 'Indicator Code',
        },
        {
            id: 'name',
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
            id: 'direct_cost',
            numeric: false,
            disablePadding: false,
            label: 'Direct Inputs',
        },
        {
            id: 'resource_cost',
            numeric: false,
            disablePadding: false,
            label: 'Resource Inputs',
        },
        {
            id: 'total_cost',
            numeric: false,
            disablePadding: false,
            label: 'Total Inputs',
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
            id: 'evaluation_budget',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Budget',
        },
        {
            id: 'evaluation_target',
            numeric: false,
            disablePadding: false,
            label: 'Evaluation Against Target',
        },
    ]

    const styler = (progress: string) => {
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
            case 'goal':
                return "Indicators Evaluation";
            case 'outcome':
                return "Indicators Evaluation"
            case 'combined':
                return "Indicators Evaluation"
            default:
                break
        }
    }

    const customTableFunction = () => {
        switch (evaluatedItem) {
            case 'goal':
                return {data: data?.goals}
            case 'outcome':
                return {data: data?.outcomes}
            case 'combined':
                return {data: data?.goals}
            default:
                break
        }
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
        {
            name: "Combined",
            from: "combined"
        },
    ]

    const pageBody = () => {
        return (
            <div className="flex flex-col p-4 h-full w-full bg-white">
                <div className="bg-white px-2 ">
                    <div className="overflow-x-auto">
                        <div className="min-w-[750px]">
                            <h3 className="text-left font-semibold mb-1"> {reportHeader()} </h3>
                            {
                                customTableFunction()?.data?.length > 0 ?
                                    <div>
                                        <div className="grid grid-cols-7 border border-gray-500  bg-gray-200 ">
                                            {columns.map((item, index) => {
                                                    const isLast = index === columns.length - 1;
                                                    return (

                                                        <div key={index}
                                                             className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''}  border-gray-500 pl-1`}>
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
                                                    return (
                                                        < >
                                                            {itemRender(item1, index)}
                                                            {evaluatedItem === "combined" && item1.outcomes && item1.outcomes.length > 0 && item1.outcomes.map((outcome: any, index: any) => {
                                                                return <>
                                                                    {itemRender(outcome, index)}
                                                                </>
                                                            })}
                                                        </>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </div>
                                    : <NoDataComponent/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const itemRender = (item1: any, index: any) => {
        const isFirst = index === 0;
        return (
            < >
                <div key={index}
                     className={`grid grid-cols-7 ${!isFirst ? 'border-t' : 'border-t'} border-b border-r border-l border-gray-500`}>
                    <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                        <p className="text-xs ">
                            {item1.formatted_code}
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
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
                    <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                        <p className="text-xs ">
                            {item1.evaluation_date}
                        </p>
                    </div>
                    <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                        <p className="text-xs ">
                            {item1.evaluation_target}
                        </p>
                    </div>
                    <div
                        className={`flex flex-col ${styler(item1.evaluation_time)}  justify-center items-center border-r p-1`}>
                        <p className="text-xs ">{item1.evaluation_time === 'pending' && "Pending"} </p>
                    </div>
                </div>
                <div className="border-l border-gray-500">
                    <div className="border-b border-gray-500" style={{marginLeft: "240px"}}>
                        <div
                            className="flex flex-col col-span-5 justify-center items-start p-1 border-r border-l border-gray-500 ">
                            <p className="text-sm font-semibold ">
                                Indicators Evaluation
                            </p>
                        </div>
                        <div className="grid grid-cols-7 border border-gray-500  bg-gray-200 ">
                            {indicatorColumns.map((item, index) => {
                                const isLast = index === indicatorColumns.length - 1;
                                return (
                                    <div key={index}
                                         className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''}  border-gray-500 pl-1`}>
                                        <p className="text-xs ">
                                            {item.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        {item1?.indicators.map((item2, index) => {
                            const isLast = index === item1?.indicators.length - 1;
                            return (
                                <div key={index} className={`grid grid-cols-7 border-r border-l border-gray-500`}>
                                    {/* <div className="flex flex-col col-span-3 justify-center items-center border-r border-gray-500 p-1">
                                </div> */}
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p className="text-xs ">
                                            {item2.indicator_code}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p className="text-xs ">
                                            {item2.indicator}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p className="text-xs ">
                                            {item2.baseline_data}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p className="text-xs ">
                                            {item2.target_data}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p className="text-xs ">
                                            {item2.evaluation_data}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                        <p style={{fontSize: '0.625rem', fontWeight: 600}}>
                                            {item2.evaluation_target}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border-gray-500  p-1 ${styler(item2.evaluation_time)} ${!isLast ? 'border-b' : ''}`}>
                                        <p style={{
                                            fontSize: '0.625rem',
                                            fontWeight: 600
                                        }}>{item2.evaluation_time === 'pending' && "Pending"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="border-l border-gray-500">
                    <div className="" style={{marginLeft: "240px"}}>
                        <div
                            className="flex flex-col col-span-5 justify-center items-start p-1 border-r border-l border-gray-500 ">
                            <p className="text-sm font-semibold ">
                                Input Evaluation
                            </p>
                        </div>
                        <div className="grid grid-cols-7 border border-gray-500  bg-gray-200 ">
                            {costColumns.map((item, index) => {
                                const isLast = index === costColumns.length - 1;
                                return (
                                    <div key={index}
                                         className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''}  border-gray-500 pl-1`}>
                                        <p className="text-xs ">
                                            {item.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={`grid grid-cols-7 border-r border-l border-gray-500`}>
                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p style={{fontSize: '0.625rem', fontWeight: 600}}>{FormattedMoney({
                                    amount: item1.cost,
                                    isHideCurrency: true
                                })}</p>
                            </div>
                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p style={{
                                    fontSize: '0.625rem',
                                    fontWeight: 600
                                }}>{FormattedMoney({amount: item1.resource_cost, isHideCurrency: true})}</p>
                            </div>
                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p style={{
                                    fontSize: '0.625rem',
                                    fontWeight: 600
                                }}>{FormattedMoney({
                                    amount: Number(item1.cost) + Number(item1.resource_cost),
                                    isHideCurrency: true
                                })}</p></div>
                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p className="text-xs ">
                                    {item1.occured_cost}
                                </p>
                            </div>

                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p className="text-xs ">
                                    {item1.evaluated_expense}
                                </p>
                            </div>
                            <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                <p style={{fontSize: '0.625rem', fontWeight: 600}}>
                                    {item1.evaluation_against_budget}
                                </p>
                            </div>
                            <div
                                className={`flex flex-col justify-center items-center p-1 ${styler(item1.evaluation_against_target)} }`}>
                                <p style={{fontSize: '0.625rem', fontWeight: 600}}>
                                    {/* {item1.evaluation_against_target} */}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    const pageRender = () => {
        return <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col">
                        <PageHeader
                            links={[
                                {
                                    name: 'Project Evaluation Report',
                                    linkTo: '/report/evaluation-report',
                                    permission: ''
                                },
                                {name: 'Show', linkTo: '/projects/show', permission: ''},
                            ]}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={<GeneratePdf
                                content={pageBody()}
                                fileName="MyDocument.pdf"
                                buttonLabel="Generate PDF"
                            />}/>
                        <div className="bg-white h-full ">
                            <div className="flex flex-col md:flex-row ">
                                <div className="flex flex-col w-36 font-semibold ml-4 p-2">
                                    <h4 className="text-sm  ">Evaluation Items</h4>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex flex-col ml-3 text-xs gap-1 cursor-pointer py-2">
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
                                {pageBody()}
                            </div>
                        </div>
                    </div>
            }
        </ProtectedRoute>
    }

    return (
        <>
            {pageRender()}
        </>
    );
};

export default EvaluationReportShow;