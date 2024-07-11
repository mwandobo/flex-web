"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LinearWithValueLabel from "@/components/bars/progressBar";
import CircularWithValueLabel from "@/components/bars/circularBar";
import LeadsChart from "../comps/buget";
import { getValueFromLocalStorage, setValueLocalStorage } from "@/utils/actions/local-starage";
import { Check, ChevronDown, ChevronUp, CircleCheckBig, ClipboardCheck, OctagonX } from "lucide-react";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import swal from 'sweetalert2';
import FormattedMoney from "@/components/moneyFormater";

const ProjectEvaluationShow = ({ params }: { params: { evaluationId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [allIndicators, setAllIndicators] = useState<any[]>([])
    const [payload, setPayload] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isCollecting, setIsCollecting] = useState(false)
    const token = getValueFromLocalStorage('token')
    const { state, dispatch } = useGlobalContextHook()
    const { selectedMonitoringItem, evaluationForm } = state;
    const { selected, expandedItem } = selectedMonitoringItem
    const id = params.evaluationId

    const handleMonotiringPayload = (input: any) => {
        const monitoringPayload = [
            { name: "Project Goals", data: input.goals, type: 'goal', progress: input.goals_progress },
            { name: "Project Outcomes", data: input.outcomes, type: 'outcome', progress: input.outcomes_progress },
        ]
        setPayload(monitoringPayload)

        setAllIndicators(input.all_indicators)

        const selcted_monitoring_item = getValueFromLocalStorage('selected_monitoring_item')
        const expanded_monitoring_item = getValueFromLocalStorage('expanded_monitoring_item')

        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'selected', value: selcted_monitoring_item } })
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'expanded', value: expanded_monitoring_item } })
    }

    const progresRender = (progress?: any) => {
        if (progress === 0) {
            return <LinearWithValueLabel value={0} />
        } else if (Number(progress) > 0) {
            return <LinearWithValueLabel value={Number(progress)} />

        } else {
            return "No Indicator";
        }
    }

    const valueFinder = (indicatorId: any, from: string, type?: string) => {
        let value = null
        switch (from) {
            case 'progress':
                const fountItem = evaluationForm.data.find(item => item.id.toString() === indicatorId.toString())
                value = fountItem?.value;
                break;
            case 'cost':
                const fountCost = evaluationForm.data.find(item => item.id.toString() === indicatorId.toString() && item.for === type && item.parent)
                value = fountCost?.value;
                break;
        }
        return value
    }

    const formRefresh = () => {
        const form = evaluationForm.data.map(item => { return { ...item, value: '' } })
        dispatch({ type: 'UPDATE_EVALUATION_FORM', payload: form })
        setValueLocalStorage('evaluation_form', JSON.stringify(form))
    }

    const handleMonitoringItemChange = (item: string) => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'selected', value: item } })
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'expanded', value: 'no' } })
        setValueLocalStorage('selected_monitoring_item', item)
    }

    const handleItemExpand = (item: string, index: any) => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'expanded', value: index } })
        setValueLocalStorage('expanded_monitoring_item', index)
    }

    const handleCollectAction = async () => {
        setIsCollecting(!isCollecting)
    }

    const handleFormInputChange = (e: any, body: any, from: string, type?: string) => {

        const newPayload = evaluationForm.data.map(item => {
            switch (from) {
                case 'progress':
                    if (item.id.toString() === body.id.toString() && !item.parent) {
                        return { ...item, value: e.target.value }
                    }
                    return item;
                case 'cost':
                    if (item.for === type && item.id.toString() === body.id.toString() && item.parent) {

                        return { ...item, value: e.target.value }
                    }
                    return item;
                default: break;
            }
        })

        setValueLocalStorage('evaluation_form', JSON.stringify(newPayload))
        dispatch({ type: 'UPDATE_EVALUATION_FORM', payload: newPayload })
    }

    const handleSubmitEvaluationsdData = async () => {
        if (evaluationForm) {
            if (validator()) {
                const newForm = { project_id: id, ...evaluationForm }
                const response = await post<any>('project_evaluation_report/store', newForm, token)

                if (response?.status === 200) {
                    setIsSubmitted(!isSubmitted)
                } else {
                    console.log('errorHappened')
                }

                setIsSubmitted(!isSubmitted)
                formRefresh()

                swal.fire({
                    title: 'Evaluation Report Saved!',
                    text: "You Have Submitted your report  Successfully",
                    icon: 'success'
                });
            } else {
                swal.fire({
                    title: 'Error Occured!',
                    text: "You Have Not Filled All The Evaluations Data. Please Try Again",
                    icon: 'error',
                });
            }
        }
    }

    const buttonActive = () => {
        let isActive = true
        if (evaluationForm.data.length > 0) {
            evaluationForm.data.forEach(item => {
                if (item.value) {
                    isActive = false
                }
            })
        }
        return isActive
    }

    const validator = () => {
        const pass = evaluationForm.data.every(item => item.value && item.value > 0)
        return pass
    }

    useEffect(() => {
        if (allIndicators && allIndicators.length > 0) {
            let newFormPayload = allIndicators.map(item => {
                const body = { id: item.id, value: '', for: item.from, parent: item.parent }
                return body
            })
            const evaluationForm = getValueFromLocalStorage('evaluation_form')
            const form = JSON.parse(evaluationForm)
            if (form && form.length > 0) {
                dispatch({ type: 'UPDATE_EVALUATION_FORM', payload: newFormPayload })

            } else {
                dispatch({ type: 'UPDATE_EVALUATION_FORM', payload: newFormPayload })
            }
        }
    }, [allIndicators])

    const url = `project_evaluation/show/${id}`
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)
                if (data && res.status === 200) {
                    setData(res.data.data)
                    handleMonotiringPayload(res.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    swal.fire({
                        title: 'Error!',
                        text: "An Error Occured",
                        icon: 'error'
                    });

                    console.log(error)
                }
            }
        };
        fetchData()
    }, [id, token, isSubmitted])

    useEffect(() => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'selected', value: 'goal' } })
        setValueLocalStorage('selected_monitoring_item', 'goal')
    }, [])

    const indicatorBodyCreator = (payload: any[]) => {
        if (payload?.length <= 0) {
            return <p>No Indicators</p>
        }

        return <div className="flex ">
            <div className="w-11/12 mx-auto border border-gray-300 flex flex-col px-2">
                <div className="text-sm py-2 font-semibold"><h5>Indicators List</h5></div>
                <div className="mb-1">
                    <div className="grid grid-cols-7 gap-4 text-xs border-b border-t border-gray-300">
                        <p className="text-start border-r border-gray-300 p-2">#</p>
                        <p className="text-start border-r border-gray-300 p-2">Code</p>
                        <p className="text-start border-r border-gray-300 p-2">Indicator Name</p>
                        <p className="text-start border-r border-gray-300 p-2">Verify By</p>
                        <p className="text-start border-r border-gray-300 p-2">Baseline Data</p>
                        <p className="text-start border-r border-gray-300 p-2">Target Data</p>
                        <p className="">Evaluation Data</p>
                    </div>
                </div>
                <div >
                    {
                        payload.map((item: any, index: any) =>
                            <div key={index} className="flex ">
                                <div className="grid grid-cols-7 gap-4 w-full text-xs border-b border-gray-300 ">
                                    <p className="text-start border-r border-gray-300 p-1">{index + 1}</p>
                                    <p className="text-start border-r border-gray-300 p-1">{item.formatted_code}</p>
                                    <p className="text-start border-r border-gray-300 p-1">{item.name}</p>
                                    <p className="text-start border-r border-gray-300 p-1">{item.mov}</p>
                                    <p className="text-start border-r border-gray-300 p-1">{item.baseline_data}</p>
                                    <p className="text-start border-r border-gray-300 p-1">{item.target_data}</p>
                                    {
                                        !isCollecting ? <p>waiting...</p> :
                                            <input type="text" placeholder="Enter Evaluated Data" value={valueFinder(item.id, 'progress')} className="ps-1 h-7 w-full" onChange={(e) => handleFormInputChange(e, item, 'progress')} />

                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    }

    const inputBodyCreator = (item: any, from: string) => {

        if (!item) {
            return <p>No Inputs</p>
        }

        return <div className="flex">
            <div className="w-11/12 mx-auto border border-gray-300 flex flex-col">
                <div className="font-semibold text-sm py-2 ps-2"><h5>Input Evaluation</h5></div>

                <div className="">
                    <div className="grid grid-cols-4 text-xs border-b border-t border-gray-300">
                        <p className="border-r border-gray-300 ps-2 py-2">Direct Cost (Tzs)</p>
                        <p className="border-r border-gray-300 ps-2 py-2">Resource Cost (Tzs)</p>
                        <p className="border-r border-gray-300 ps-2 py-2">Total Cost (Tzs)</p>
                        <p className="ps-2 py-2">{isCollecting && 'Evaluated'} Expense</p>
                    </div>
                </div>
                <div className="" >
                    <div className="">

                        <div className="flex flex-col odd:bg-gray-200" >
                            <div className="grid grid-cols-4 w-full text-xs border-b border-gray-300 ">
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({ amount: item.cost, isHideCurrency: true })}</p>
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({ amount: item.resource_cost, isHideCurrency: true })}</p>
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({ amount: item.total_cost, isHideCurrency: true })}</p>
                                <div className="text-end border-r border-gray-300 p-1">
                                    {
                                        isCollecting && Number(item.total_cost) > 0 ?
                                            <input type="text" placeholder="Enter Evaluated Expense" value={valueFinder(item.id, 'cost', from)} className="ps-1 h-7 w-full text-xs" onChange={(e) => handleFormInputChange(e, item, 'cost', from)} />
                                            :
                                            <p className="text-end">{FormattedMoney({ amount: item.occured_cost, isHideCurrency: true })}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    const pageRender = (payload: any, from?: string) => {

        if (payload && Object.keys(payload).length > 0 && payload.data && payload.data.length > 0) {
            return <div className="flex">
                <div className="w-full flex flex-col border-b border-gray-300">
                    <div className=" bg-gray-300 border-t border-gray-400 ">
                        <div className="grid grid-cols-7  ">
                            <p className="text-start border-r border-gray-400 p-2">#</p>
                            <p className="text-start border-r border-gray-400 p-2">Code</p>
                            <p className="text-start  border-r border-gray-400 p-2">Name</p>
                            <p className="text-start border-r border-gray-400 p-2">Progress</p>
                            <p className="text-start border-r border-gray-400 p-2">Budget (Tzs)</p>
                            <p className="text-start border-r border-gray-400 p-2">Expenses (Tzs)</p>
                            <p className="text-start p-2"></p>
                        </div>
                    </div>
                    <div className=" " >
                        <div className="">
                            {
                                payload.data.map((item: any, index: any) =>
                                    <div key={index} className="flex flex-col odd:bg-gray-200 border-b border-gray-300" >
                                        <div className="grid grid-cols-7 w-full text-sm font-light "
                                        >
                                            <p className="text-start border-r border-gray-300 p-1">{index + 1}</p>
                                            <p className="text-start border-r border-gray-300 p-1"> {item.formatted_code}</p>
                                            <p className="text-start border-r border-gray-300 p-1">{item.name}</p>
                                            <p className="text-start border-r border-gray-300 p-1">{progresRender(item.progress)}</p>
                                            <p className="text-end border-r border-gray-300 p-1" >{FormattedMoney({ amount: item.total_cost, isHideCurrency: true })}</p>
                                            <p className="text-end border-r border-gray-300 p-1">{FormattedMoney({ amount: item.occured_cost, isHideCurrency: true })}</p>
                                            <p className={`flex justify-center `}
                                                onClick={() => handleItemExpand(item, index)}
                                            >
                                                {progresRender(item.progress) !== "No Indicator" ?
                                                    <>
                                                        {expandedItem === index ?
                                                            <ChevronUp className="text-gray-900 cursor-pointer" size={22} /> :
                                                            <ChevronDown className="text-gray-400 cursor-pointer" size={20} />
                                                        }
                                                    </> :
                                                    <p>-</p>
                                                }
                                            </p>
                                        </div>
                                        <>
                                            {expandedItem === index && selected === payload.type && progresRender(item.progress) !== "No Indicator" &&
                                                < div className="mb-6">
                                                    {indicatorBodyCreator(item.indicators)}
                                                </div>
                                            }
                                            {expandedItem === index && selected === payload.type &&
                                                < div className="mb-6">
                                                    {inputBodyCreator(item, from)}
                                                </div>
                                            }
                                        </>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >
        }
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col h-full">
                        <PageHeader
                            links={[
                                { name: 'Project Evaluation', linkTo: '/project-monitoring', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <div className="bg-white h-full ">
                            <div className="flex ">
                                <div className="flex flex-col w-64 mt-4 ml-4 p-2">
                                    <h4 className="text-sm font-semibold mb-2">Evaluation Items</h4>
                                    <div className="flex flex-col justify-between h-full">
                                        <div className="flex flex-col ml-3 text-sm gap-1 cursor-pointer py-5">
                                            <p
                                                className={`p-1  hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'goal' && 'bg-sidebar-background text-sidebar-active'} `}
                                                onClick={() => handleMonitoringItemChange('goal')}>
                                                Goals
                                            </p>
                                            <p
                                                className={`p-1  hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'outcome' && 'bg-sidebar-background text-sidebar-active'}`}
                                                onClick={() => handleMonitoringItemChange('outcome')}>
                                                Outcomes
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {
                                            !buttonActive() &&
                                            <button
                                                className={`border flex items-center text-sm text-white  border-gray-300 px-2 py-1 ${isCollecting ? 'bg-gray-400' : 'bg-gray-500 '} shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                onClick={() => handleSubmitEvaluationsdData()}
                                                disabled={buttonActive()}
                                            >
                                                Submit
                                            </button>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col p-4 h-full w-full bg-white">
                                    {
                                        payload.map((pay, index) =>
                                            <div key={index} className="h-full">
                                                {pay.type === selected &&
                                                    <>  {pay.data.length > 0 ?

                                                        <div key={index} className="h-full relative bg-gray-100 shadow-md w-full p-3">
                                                            <div className="flex justify-between">
                                                                <h3 className="p-1 font-semibold">{pay.name}</h3>
                                                                <div className="flex justify-center gap-3 items-center p-2">
                                                                    <button
                                                                        className={`border flex items-center text-sm text-white  border-gray-300 px-2 py-1 ${isCollecting ? 'bg-gray-400' : 'bg-gray-500 '} shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                                        onClick={() => handleCollectAction()}
                                                                    >
                                                                        {isCollecting ? <Check size={10} className="mr-1" /> : <ClipboardCheck size={15} className="mr-1" />}
                                                                        {isCollecting ? 'Exit Evaluating' : 'Evaluate'}
                                                                    </button>
                                                                    <CircularWithValueLabel value={Number(pay.progress)} />
                                                                </div>
                                                            </div>
                                                            {pay.data?.length > 0 &&
                                                                <>
                                                                    {pageRender(pay, pay.type)}
                                                                </>
                                                            }
                                                        </div>
                                                        :
                                                        <div className="w-full h-36 flex justify-center items-center ">
                                                            <div className="animate-pulse">
                                                                <OctagonX />
                                                                <p>No data</p>
                                                            </div>
                                                        </div>
                                                    }
                                                    </>
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </ProtectedRoute>
    );
};

export default ProjectEvaluationShow;