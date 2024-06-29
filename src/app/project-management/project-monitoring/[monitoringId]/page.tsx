"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LinearWithValueLabel from "@/components/bars/progressBar";
import CircularWithValueLabel from "@/components/bars/circularBar";
import { getValueFromLocalStorage, setValueLocalStorage } from "@/utils/actions/local-starage";
import { Activity, ChevronDown, ChevronUp, CircleCheckBig, ClipboardCheck, OctagonX } from "lucide-react";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import FormattedMoney from "@/components/moneyFormater";

const ProjectMonitoringShow = ({ params }: { params: { monitoringId: string } }) => {
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
    const id = params.monitoringId

    const handleMonotiringPayload = (input: any) => {
        const monitoringPayload = [
            { name: "Project Output", data: input.outputs, type: 'outputs', progress: input.outputs_progress },
            { name: "Project Activity", data: input.activities, type: 'activities', progress: input.activities_progress },
            { name: "Project Budget", data: input.inputs, type: 'budget', progress: 1 }
        ]

        setPayload(monitoringPayload)

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

    const url = `project_monitoring/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const handleMonitoringItemChange = (item: string) => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'selected', value: item } })
        setValueLocalStorage('selected_monitoring_item', item)
    }

    const handleItemExpand = (item: string, index: any) => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'expanded', value: index } })
        setValueLocalStorage('expanded_monitoring_item', index)
    }

    const handleCollectAction = async () => {
        setIsCollecting(!isCollecting)
    }

    const handleFormInputChange = (e: any, indicator: any, from: string) => {
        switch (from) {
            case 'progress':
                setFormPayload({ ...formPayload, indicator_id: indicator.id, quantity: e.target.value }); break;
            case 'cost':
                setFormPayload({ ...formPayload, indicator_id: indicator.activity_id, cost: e.target.value, from: indicator.from, from_id: indicator.from_id }); break;
            default: break;
        }

    }

    const handleSubmitCollectedData = async () => {
        if (formPayload) {
            const response = await post<any>('collected_data/store', formPayload, token)
            if (response?.status === 200) {
                setIsSubmitted(!isSubmitted)
                setFormPayload(null)
            } else {
                console.log('errorHappened')
            }
        }
    }

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
                    navigateToLogin()
                }
            }
        };
        fetchData()
    }, [id, token, isSubmitted])

    useEffect(() => {
        dispatch({ type: "UPDATE_SELECTED_MONITORING_ITEM", payload: { for: 'selected', value: 'goal' } })
        setValueLocalStorage('selected_monitoring_item', 'outputs')
    }, [])

    const indicatorBodyCreator = (payload: any[]) => {
        if (payload.length <= 0) {
            return <p>No Indicators</p>
        }

        return <div className="flex ">
            <div className="w-11/12 mx-auto border border-gray-300 flex flex-col px-2">
                <div className="font-semibold text-sm py-1"><h5>Indicators List</h5></div>
                <div className="mb-1">
                    <div className="grid grid-cols-9 gap-4 text-xs border-b border-gray-300">
                        <p className="" >#</p>
                        <p className="">Code</p>
                        <p className="">Indicator Name</p>
                        <p className="">Verify By</p>
                        <p className="">Baseline Data</p>
                        <p className="">Target Data</p>
                        <p className="">Collected Data</p>
                        <p className="">Progress</p>
                        <p className=""></p>
                    </div>
                </div>
                <div >
                    {
                        payload.map((item: any, index: any) =>
                            <div key={index} className="flex ">
                                <div className="grid grid-cols-9 gap-4 w-full text-xs p-1 border-b border-gray-300 ">
                                    <p>{index + 1}</p>
                                    <p>{item.formatted_code}</p>
                                    <p>{item.name}</p>
                                    <p>{item.mov}</p>
                                    <p>{item.baseline_data}</p>
                                    <p>{item.target_data}</p>
                                    <p>{item.collected_data}</p>

                                    {isCollecting ?
                                        <>
                                            <input type="text" placeholder="Enter Data" className="ps-1 h-7 w-20" onChange={(e) => handleFormInputChange(e, item, 'progress')} />
                                        </> :
                                        <>
                                            <p className="">{progresRender(item.progress)}</p>
                                        </>
                                    }

                                    {isCollecting &&
                                        <button
                                            className={`h-7 w-16 flex justify-center items-center px-1 text-white border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                            onClick={() => handleSubmitCollectedData()}
                                        >
                                            <CircleCheckBig className="mr-1" />
                                            Submit</button>
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    }

    const pageRender = (payload: any, from?: string) => {
        if (from === 'budget') {
            if (payload && Object.keys(payload).length > 0 && payload.data && payload.data.length > 0) {
                return <div className="flex">
                    <div className="w-full flex flex-col">
                        <div className=" bg-gray-300 p-2">
                            <div className="grid grid-cols-6">
                                <p className="text-start">#</p>
                                <p className="text-start">Activity Name</p>
                                <p className="text-start">Input Type</p>
                                <p className="text-start">Budget</p>
                                <p className="text-start">Expense</p>
                                <p className="text-start"></p>
                            </div>
                        </div>
                        <div className="" >
                            <div className="">
                                {
                                    payload.data.map((item: any, index: any) =>
                                        <div key={index} className="flex flex-col odd:bg-gray-200 px-2 " >
                                            <div className="grid grid-cols-6 w-full p-1 text-sm font-light"
                                            >
                                                <p className="bg-green-200">{index + 1}</p>
                                                <p>{item.activity}</p>
                                                <p>{item.type}</p>
                                                <p>{item.amount}</p>
                                                <div className="flex justify-start col-span-2 w-full gap-5" >
                                                    {isCollecting ?
                                                        <input type="text" placeholder="Enter Expense" className="ps-1 h-7 w-full" onChange={(e) => handleFormInputChange(e, item, 'cost')} />
                                                        :
                                                        <p className="text-end">{item.occured_cost}</p>
                                                    }
                                                    <div>
                                                        {isCollecting &&
                                                            <button
                                                                className={`h-100 w-16 flex justify-center items-center px-1 text-white border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                                onClick={() => handleSubmitCollectedData()}
                                                            >
                                                                <CircleCheckBig style={{ width: '30px', height: '30px', marginRight: '5px' }} />
                                                                Submit
                                                            </button>
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }



        } else {
            if (payload && Object.keys(payload).length > 0 && payload.data && payload.data.length > 0) {
                return <div className="flex">
                    <div className="w-full flex flex-col">
                        <div className=" bg-gray-300 p-2">
                            <div className="grid grid-cols-6">
                                <p className="text-start">#</p>
                                <p className="text-start">Code</p>
                                <p className="text-start">Name</p>
                                <p className="text-start">Progress</p>
                                <p className="text-center">Cost</p>
                                <p className="text-start"></p>
                            </div>
                        </div>
                        <div className="" >
                            <div className="">
                                {
                                    payload.data.map((item: any, index: any) =>
                                        <div key={index} className="flex flex-col odd:bg-gray-200 px-2 " >
                                            <div className="grid grid-cols-6 w-full p-1 text-sm font-light"
                                            >
                                                <p>{index + 1}</p>
                                                <p>{item.formatted_code}</p>
                                                <p>{item.name}</p>
                                                <p className="">{progresRender(item.progress)}</p>
                                                <p className="text-end">{FormattedMoney({ amount: item.occured_cost })}</p>
                                                <p className={`flex justify-end `}
                                                    onClick={() => handleItemExpand(item, index)}
                                                >
                                                    {expandedItem === index && progresRender(item.progress) !== "No Indicator" ?
                                                        <ChevronUp className="text-gray-900" size={22} /> :
                                                        <ChevronDown className="text-gray-400" size={20} />}
                                                </p>
                                            </div>
                                            <>
                                                {expandedItem === index && progresRender(item.progress) !== "No Indicator" &&
                                                    <div className="mb-6">
                                                        {indicatorBodyCreator(item.indicators)}
                                                    </div>
                                                }
                                            </>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        }
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col">
                        <PageHeader
                            links={[
                                { name: 'Project Monitoring', linkTo: '/project-monitoring', permission: '' },
                                { name: 'Show', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <div className="bg-white ">
                            <div className="flex ">
                                <div className="flex flex-col w-64 mt-4 ml-4 p-2">
                                    <h4 className="text-sm font-semibold mb-2">Monitoring Items</h4>
                                    <div className="flex flex-col ml-3 text-sm gap-1 cursor-pointer">
                                        <p
                                            className={`p-1  hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'outputs' && 'bg-sidebar-background text-sidebar-active'}`}
                                            onClick={() => handleMonitoringItemChange('outputs')}>
                                            Outputs
                                        </p>
                                        <p
                                            className={`p-1  hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'activities' && 'bg-sidebar-background text-sidebar-active'}`}
                                            onClick={() => handleMonitoringItemChange('activities')}>
                                            Activities
                                        </p>
                                        <p
                                            className="p-1  hover:bg-sidebar-background hover:text-sidebar-active "
                                            onClick={() => handleMonitoringItemChange('budget')}>
                                            Inputs
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col p-4 h-full w-full bg-white">
                                    {
                                        payload.map((pay, index) =>
                                            <div key={index} className="">
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
                                                                        {isCollecting ? <Activity size={10} className="mr-1" /> : <ClipboardCheck size={15} className="mr-1" />}
                                                                        {isCollecting ? 'Monitoring ...' : 'Start Monitoring'}
                                                                    </button>
                                                                    <CircularWithValueLabel value={Number(pay.progress)} />
                                                                </div>
                                                            </div>
                                                            {pay.data?.length > 0 &&
                                                                <>
                                                                    {pageRender(pay, pay.type)}
                                                                </>


                                                            }
                                                        </div> :
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

export default ProjectMonitoringShow;