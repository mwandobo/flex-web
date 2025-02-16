"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { baseURL, get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import NoDataComponent from "@/components/status/no-data";
import { capitalizeFirstWord } from "@/utils/actions/string-manipulations";
import FormattedMoney from "@/components/moneyFormater";
import GeneratePdf from "@/components/pdf/generate-pdf";

const LearningReportShow = ({ params }: { params: { learningReportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [evaluatedItem, setEvaluatedItem] = useState('goal')
    const token = getValueFromLocalStorage('token')
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

    useEffect(() => {
        setEvaluatedItem('output')
    }, [])

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
            id: 'learning_target',
            numeric: false,
            disablePadding: false,
            label: 'Progress Against Target (%)',
        },
        {
            id: 'learning_time',
            numeric: false,
            disablePadding: false,
            label: 'Time Utilization Efficiency',
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
            id: 'target_data',
            numeric: false,
            disablePadding: false,
            label: 'Target Data',
        },
        {
            id: 'evaluation_data',
            numeric: false,
            disablePadding: false,
            label: 'Monitoring Data',
        },
        {
            id: 'evaluation_target',
            numeric: false,
            disablePadding: false,
            label: 'Progress Against Target (%)',
        },
        {
            id: 'evaluation_time',
            numeric: false,
            disablePadding: false,
            label: 'Time Utilization Efficiency',
        },
    ]

    const actvityInputColumns = [
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Input Type',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Input Name',
        },
        {
            id: 'budget',
            numeric: false,
            disablePadding: false,
            label: 'Budget (Tzs)',
        },
        {
            id: 'expense',
            numeric: false,
            disablePadding: false,
            label: 'Expense (Tzs)',
        },
        {
            id: 'utilization',
            numeric: false,
            disablePadding: false,
            label: 'Budget Utilization (%)',
        },
    ]

    const outputInputColumns = [
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
            id: 'evaluation_budget',
            numeric: false,
            disablePadding: false,
            label: 'Budget Utilization (%)',
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
            case 'output':
                return <p className="flex items-center"><span
                    className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span> Indicators
                    Learning Report</p>
            case 'activity':
                <p className="flex items-center"><span
                    className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span> Indicators
                    Learning Report</p>
            case 'input':
                <p className="flex items-center"><span
                    className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span> Inputs
                    Learning Report</p>
            default:
                break
        }

        return <p className="flex items-center"><span
            className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span> Indicators
            Learning Report</p>
    }

    const customTableFunction = () => {
        switch (evaluatedItem) {
            case 'output':
                return { data: data?.outputs }
            case 'activity':
                return { data: data?.activities }
            case 'combined':
                return { data: data?.outputs }
            default:
                break
        }
    }

    const handleMonitoringItemChange = (item: string) => {
        setEvaluatedItem(item)
    }

    const learningItems = [
        {
            name: "Output",
            from: "output"
        },
        {
            name: "Activity",
            from: "activity"
        },
        {
            name: "Combined",
            from: "combined"
        },
    ]

    const inputColumns = (type: string) => {
        return type === "output" ? outputInputColumns : actvityInputColumns
    }


    const itemRender = (item1: any, index: any) => {
        const isFirst = index === 0;
        return < >
            <div key={index}
                className={`grid grid-cols-6 ${!isFirst ? 'border-t' : 'border-t'} border-b border-r border-l border-gray-500`}>
                <div
                    className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                    <p className="text-xs ">
                        {item1.formatted_code}
                    </p>
                </div>
                <div
                    className="flex flex-col justify-center items-center  border-r border-gray-500 p-1">
                    <p className="text-xs ">
                        {item1.name}
                    </p>
                </div>
                <div
                    className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                    <p className="text-xs ">
                        {item1.start_date}
                    </p>
                </div>
                <div
                    className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                    <p className="text-xs ">
                        {item1.end_date}
                    </p>
                </div>
                <div
                    className="flex flex-col justify-center border-r border-gray-500 items-end p-1">
                    <p className="text-xs">
                        {item1.learning_against_target}
                    </p>
                </div>
                <div
                    className={`flex flex-col justify-center  items-end p-1 ${styler(item1.learning_against_target)}`}>
                    <p className="text-xs text-end">
                    </p>
                </div>
            </div>

            <div className="border-l border-gray-500">
                <div className="border-b border-gray-500"
                    style={{ marginLeft: "240px" }}>
                    <div
                        className="flex flex-col col-span-5 justify-center items-start p-1 border-r border-l border-gray-500 ">
                        <p className="text-sm font-semibold ">
                            Indicators Evaluation
                        </p>
                    </div>
                    <div
                        className="grid grid-cols-6 border border-gray-500  bg-gray-200 ">
                        {
                            item1.indicators.length <= 0 ?
                                <p className="text-xs bold text-center w-full p-1 font-semibold ">No
                                    Data </p>
                                :
                                indicatorColumns.map((item, index) => {
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
                            <div key={index}
                                className={`grid grid-cols-6 border-r border-l border-gray-500`}>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                    <p className="text-xs ">
                                        {item2.formatted_code}
                                    </p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                    <p className="text-xs ">
                                        {item2.name}
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
                                        {item2.collected_data}
                                    </p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                    <p style={{
                                        fontSize: '0.625rem',
                                        fontWeight: 600
                                    }}>
                                        {item2.progress}
                                    </p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center p-1 ${styler(item2.learning_time)} ${!isLast ? 'border-b' : ''}`}>
                                    <p style={{
                                        fontSize: '0.625rem',
                                        fontWeight: 600
                                    }}>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border-l border-gray-500">
                <div className=""
                    style={{ marginLeft: "240px" }}>
                    <div
                        className="flex flex-col col-span-5 justify-center items-start p-1 border-r border-l border-gray-500 ">
                        <p className="text-sm font-semibold ">
                            Input Evaluation
                        </p>
                    </div>
                    <div
                        className={`grid grid-cols-${item1.learning_type === "output" ? "5" : "5"} border border-gray-500  bg-gray-200 `}>
                        {
                            item1.learning_type === "activity" && item1.inputs.length <= 0 ?
                                <p className="text-xs bold text-center w-full p-1 font-semibold ">No
                                    Data </p>
                                :
                                inputColumns(item1.learning_type).map((item, index) => {
                                    const isLast = index === inputColumns(item1.learning_type).length - 1;
                                    return (
                                        <div key={index}
                                            className={`flex flex-col justify-center items-center ${!isLast ? 'border-r' : ''}  border-gray-500 pl-1`}>
                                            <p className="text-xs ">
                                                {item.label}
                                            </p>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    {
                        item1.inputs ?
                            <>
                                {
                                    item1.inputs?.map((item, index) =>
                                        <div key={index}
                                            className={`grid grid-cols-5 border-r border-l border-gray-500`}>
                                            <div
                                                className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                <p className="text-xs ">
                                                    {item.from}
                                                </p>
                                            </div>
                                            <div
                                                className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                <p className="text-xs ">
                                                    {item.name}
                                                </p>
                                            </div>
                                            <div
                                                className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                                <p className="text-xs">{FormattedMoney({
                                                    amount: item.amount,
                                                    isHideCurrency: true
                                                })}</p>
                                            </div>
                                            <div
                                                className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                                <p className="text-xs">{FormattedMoney({
                                                    amount: Number(item.occured_cost),
                                                    isHideCurrency: true
                                                })}</p>
                                            </div>
                                            <div
                                                className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                                <p style={{
                                                    fontSize: '0.625rem',
                                                    fontWeight: 600
                                                }}>
                                                    {item.utilization}
                                                </p>
                                            </div>

                                        </div>
                                    )
                                }
                            </>
                            :
                            <div
                                className={`grid grid-cols-5 border-r border-l border-gray-500`}>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                    <p className="text-xs">{FormattedMoney({
                                        amount: item1.cost,
                                        isHideCurrency: true
                                    })}</p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                    <p className="text-xs">{FormattedMoney({
                                        amount: item1.resource_cost,
                                        isHideCurrency: true
                                    })}</p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                    <p className="text-xs">{FormattedMoney({
                                        amount: Number(item1.cost) + Number(item1.resource_cost),
                                        isHideCurrency: true
                                    })}</p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                    <p className="text-xs">{FormattedMoney({
                                        amount: Number(item1.occured_cost),
                                        isHideCurrency: true
                                    })}</p>
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 }`}>
                                    <p style={{
                                        fontSize: '0.625rem',
                                        fontWeight: 600
                                    }}>
                                        {item1.evaluation_against_budget}
                                    </p>
                                </div>
                            </div>
                    }

                </div>
            </div>
        </>
    }

    const pageBody = () => {
        return (
            <div className="flex flex-col p-4 h-full w-full bg-white">
                <div className="bg-white px-2 ">
                    <h3 className="text-left font-semibold mb-1"> {reportHeader()} </h3>
                    {
                        customTableFunction()?.data?.length > 0 ?
                            <div>
                                <div
                                    className="grid grid-cols-6 border border-gray-500  bg-gray-200 ">
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
                                    {
                                        customTableFunction()?.data?.map((item1, index) => {
                                            return (
                                                < >
                                                    {itemRender(item1, index)}
                                                    {evaluatedItem === "combined" && item1.activities && item1.activities.length > 0 && item1.activities.map((activity: any, index: any) => {
                                                        return <>
                                                            {itemRender(activity, index)}
                                                        </>
                                                    })}
                                                </>
                                            )
                                        }
                                        )}
                                </div>
                            </div>
                            : <NoDataComponent />
                    }
                </div>

            </div>
        );
    }

    const pageRenderHtml = () => {
        return (
            <div className="bg-white h-full ">
                <div className="flex ">
                    <div className="flex flex-col w-36 mt-4 ml-4 p-2">
                        <h4 className="text-sm font-semibold mb-2">Learning Items</h4>
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex flex-col ml-3 text-xs gap-1 cursor-pointer py-5">
                                {
                                    learningItems.map((item, index) =>
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
        );
    }


    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col">
                        <PageHeader
                            links={[
                                { name: 'Project Learning Report', linkTo: '/report/learning-report', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                            isDownload={true}
                            ButtonDownloadComponent={<GeneratePdf
                                content={pageBody()}
                                fileName="MyDocument.pdf"
                                buttonLabel="Generate PDF"
                            />} />
                        {pageRenderHtml()}
                    </div>
            }
        </ProtectedRoute>
    );
};

export default LearningReportShow;