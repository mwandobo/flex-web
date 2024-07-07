"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { baseURL, get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import NoDataComponent from "@/components/status/no-data";
import { capitalizeFirstWord } from "@/utils/actions/string-manipulations";
import FormattedMoney from "@/components/moneyFormater";
import { Download, FileDown } from "lucide-react";
import { ReusableButton } from "@/components/button/reusable-button";
import { learningReportRenderHtml } from "../fragments/learning-report-html";

const LearningReportShow = ({ params }: { params: { learningReportId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [evaluatedItem, setEvaluatedItem] = useState('goal')
    const token = getValueFromLocalStorage('token')
    const id = params.learningReportId
    const [isDownloading, setIsDownloading] = useState(false)
    const [isloadingGenaratePdf, setIsLoadingGeneratePdf] = useState(false)
    const [pdfData, setPdfData] = useState<any>(null);

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
            id: 'target_data',
            numeric: false,
            disablePadding: false,
            label: 'Target Data',
        },
        {
            id: 'collected_data',
            numeric: false,
            disablePadding: false,
            label: 'Monitoring Data',
        },
        {
            id: 'learning_target',
            numeric: false,
            disablePadding: false,
            label: 'Learning Against Target (%)',
        },
        {
            id: 'learning_time',
            numeric: false,
            disablePadding: false,
            label: 'Learning Against Time',
        },
    ]

    const costColumns = [

        {
            id: 'activity',
            numeric: false,
            disablePadding: false,
            label: "Activity Name",
        },
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
            id: 'learning_target',
            numeric: false,
            disablePadding: false,
            label: 'Learning Against Target (%)',
        },
        {
            id: 'learning_time',
            numeric: false,
            disablePadding: false,
            label: 'Learning Against Time',
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
            case 'output': return <p className="flex items-center"><span className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span>  Indicators Learning Report</p>
            case 'activity': <p className="flex items-center"><span className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span>  Indicators Learning Report</p>
            case 'input': <p className="flex items-center"><span className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span>  Inputs Learning Report</p>
            default: break
        }

        return <p className="flex items-center"><span className='font-normal text-xs me-3'>Project - {data?.project?.code}:{data?.project?.name} </span>  Indicators Learning Report</p>
    }

    const customTableFunction = () => {
        switch (evaluatedItem) {
            case 'output': return { data: data?.outputs }
            case 'activity': return { data: data?.activities }
            case 'input': return { data: data?.inputs }
            default: break
        }
    }

    const handleHeadeClick = () => {
        const doc = new jsPDF();

        doc.setFontSize(11);
        doc.text(`Project: ${data.project_name} Learning Report`, 14, 22);

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
            name: "Input",
            from: "input"
        },
    ]

    const handleClick = async () => {
        return await generatePdf()
    }


    const refreshDownloadButton = () => {
        setIsDownloading(false)
    }

    const generatePdf = async () => {
        const strippedToken = token?.substring(1, token.length - 1)

        setIsLoadingGeneratePdf(true);
        try {
            const response = await fetch(`${baseURL}/documents/generate-pdf`, {
                headers: {
                    'Authorization': `Bearer ${strippedToken}`, // Include token if authentication is required
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const pdfBlob = await response.blob();

            setPdfData(URL.createObjectURL(pdfBlob));
            setIsDownloading(true);
        } catch (error) {
            console.error('Error in testFetch', error);
        } finally {
            setIsLoadingGeneratePdf(false);
        }
    };


    const ButtonDownloadComponent = () => {
        return (
            <>
                {
                    isloadingGenaratePdf ?
                        <p className="text-xs">Generating PDF ...</p>
                        :
                        <>
                            {
                                isDownloading ?
                                    <div className="flex gap-3 items-center">
                                        <p className="text-xs">{`${data.project_name}.pdf`}</p>
                                        <a className="flex text-xs items-center text-blue-700 shadow px-2 py-1 hover:bg-green-600 hover:text-white hover:px-3  hover:py-1" href={pdfData} download={`${data.project_name}.pdf`} onClick={refreshDownloadButton}>
                                            <Download className="me-1" size={15} />  Download PDF
                                        </a>
                                    </div>
                                    :
                                    < div className=''>
                                        <ReusableButton
                                            name={'Download'}
                                            onClick={() => handleClick()}
                                        >
                                            <FileDown size={15} />
                                        </ReusableButton>
                                    </div>
                            }
                        </>
                }
            </>
        )
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
                            ButtonDownloadComponent={ButtonDownloadComponent}
                        />
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
                                <div className="flex flex-col p-4 h-full w-full bg-white">
                                    <div className="bg-white px-2 ">
                                        <h3 className="text-left font-semibold mb-1"> {reportHeader()} </h3>
                                        {
                                            customTableFunction()?.data?.length > 0 ?
                                                <>{evaluatedItem !== 'input' ?
                                                    <div>
                                                        <div className="grid grid-cols-8 border border-gray-500  bg-gray-200 ">
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
                                                                        <div key={index} className={`grid grid-cols-8 ${!isFirst ? 'border-t' : ''} border-b border-r border-l border-gray-500`}>
                                                                            <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1" >
                                                                                <p className="text-xs ">
                                                                                    {item1.name}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                                <p className="text-xs ">
                                                                                    {item1.start_date}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                                <p className="text-xs ">
                                                                                    {item1.end_date}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col col-span-3 justify-center  border-r border-gray-500 items-start p-1" >
                                                                                <p className="text-xs font-semibold">
                                                                                    Indicators
                                                                                </p>
                                                                            </div>

                                                                            <div className="flex flex-col justify-center border-r border-gray-500 items-end p-1" >
                                                                                <p className="text-xs">
                                                                                    {item1.learning_target}
                                                                                </p>
                                                                            </div>
                                                                            <div className={`flex flex-col justify-center  items-end p-1 ${styler(item1.learning_time)}`} >
                                                                                <p className="text-xs text-end">
                                                                                </p>
                                                                            </div>

                                                                        </div>
                                                                        <>
                                                                            {item1?.indicators.map((item2, index) => {
                                                                                const isLast = index === item1?.indicators.length - 1;
                                                                                return (
                                                                                    <div key={index} className={`grid grid-cols-8 border-r border-l border-gray-500`}>
                                                                                        <div className="flex flex-col col-span-3 justify-center items-center border-r border-gray-500 p-1">
                                                                                        </div>
                                                                                        <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                            <p className="text-xs ">
                                                                                                {item2?.formatted_code + " - " + item2?.name}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                            <p className="text-xs ">
                                                                                                {item2.target_data}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className={`flex flex-col justify-center items-center border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                            <p className="text-xs ">
                                                                                                {item2.collected_data}
                                                                                            </p>
                                                                                        </div>

                                                                                        <div className={`flex flex-col justify-center items-end border-r border-gray-500 p-1 ${!isLast ? 'border-b' : ''}`}>
                                                                                            <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
                                                                                                {item2.progress}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className={`flex flex-col justify-center items-end p-1 ${styler(item2.learning_time)} ${!isLast ? 'border-b' : ''}`}>
                                                                                            <p style={{ fontSize: '0.625rem', fontWeight: 600 }}>
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
                                                    </div>
                                                    :
                                                    <div>
                                                        <div className="grid grid-cols-7 border border-gray-500  bg-gray-200 ">
                                                            {costColumns.map((item, index) => {
                                                                const isLast = index === costColumns.length - 1;
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
                                                        <div className="">
                                                            {customTableFunction()?.data?.map((item1, index) => {
                                                                const isFirst = index === 0;
                                                                return (
                                                                    < >
                                                                        <div key={index} className={`grid grid-cols-7 ${!isFirst ? 'border-t' : ''} border-b border-r border-l border-gray-500`}>
                                                                            <div className="flex flex-col justify-center items-center  border-r border-gray-500 p-1" >
                                                                                <p className="text-xs ">
                                                                                    {item1.activity}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                                <p className="text-xs ">
                                                                                    {item1.from}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center items-center border-r border-gray-500 p-1">
                                                                                <p className="text-xs ">
                                                                                    {item1.name}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center  border-r border-gray-500 items-end p-1" >
                                                                                <p className="text-xs">
                                                                                    {FormattedMoney({ amount: item1.amount, isHideCurrency: true })}
                                                                                </p>
                                                                            </div>

                                                                            <div className="flex flex-col justify-center items-end p-1 border-r border-gray-500" >
                                                                                <p className="text-xs">
                                                                                    {FormattedMoney({ amount: item1.occured_cost, isHideCurrency: true })}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-col justify-center items-end p-1 border-r border-gray-500" >
                                                                                <p className="text-xs">
                                                                                    {item1.progress}
                                                                                </p>
                                                                            </div>
                                                                            <div className={`flex flex-col justify-center items-end p-1 ${styler(item1.learning_time)}`} >
                                                                                <p className="text-xs text-end">
                                                                                </p>
                                                                            </div>


                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                            )}
                                                        </div>
                                                    </div>



                                                }

                                                </>

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

export default LearningReportShow;