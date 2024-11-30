"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import {get, post} from "@/utils/api";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import LinearWithValueLabel from "@/components/bars/progressBar";
import CircularWithValueLabel from "@/components/bars/circularBar";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/actions/local-starage";
import {BetweenHorizontalStart, ChevronDown, ChevronUp, CircleCheckBig, ClipboardCheck, OctagonX} from "lucide-react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import FormattedMoney from "@/components/moneyFormater";

const ProjectMonitoringShow = ({params}: { params: { monitoringId: string } }) => {
    const router = useRouter()
    const [payload, setPayload] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [monitoredItemState, setMonitoredItemState] = useState<any>()

    const [selected, setSelected] = useState<any>()
    const [expandedV1Item, setExpandedItem] = useState<any>()

    const [formPayload, setFormPayload] = useState<any>()
    const token = getValueFromLocalStorage('token')
    const id = params.monitoringId


    const progressRender = (progress?: any) => {
        if (progress === 0) {
            return <LinearWithValueLabel value={0}/>
        } else if (Number(progress) > 0) {
            return <LinearWithValueLabel value={Number(progress)}/>

        } else {
            return "No Indicator";
        }
    }

    const fundProgressRender = (progress?: any) => {
        if (progress === 0) {
            return <LinearWithValueLabel value={0}/>
        } else if (Number(progress) > 0) {
            return <LinearWithValueLabel value={Number(progress)}/>

        } else {
            return "No Budget";
        }
    }

    const url = `project_monitoring/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const handleMonitoringItemChange = (item: string) => {
        setSelected(item)
        setValueLocalStorage('selected_monitoring_item', item)
        setExpandedItem(null)
        setValueLocalStorage('expanded_monitoring_item', null);
    }

    const handleItemExpand = (index: number) => {

        setExpandedItem(index === expandedV1Item ? null :index )
        setValueLocalStorage('expanded_monitoring_item', index === expandedV1Item ? null :index);
    };

    const isExpanded = (item: any, index: number) => {
        return expandedV1Item !== null && Number(expandedV1Item) === Number(index) && progressRender(item.progress) !== "No Indicator"
    };

    const handleFormInputChange = (e: any, indicator: any, from: string) => {
        switch (from) {
            case 'progress':
                setFormPayload({...formPayload, indicator_id: indicator.id, quantity: e.target.value});
                break;
            case 'cost':
                setFormPayload({
                    ...formPayload,
                    indicator_id: indicator.activity_id,
                    cost: e.target.value,
                    from: indicator.from,
                    from_id: indicator.from_id
                });
                break;
            default:
                break;
        }
    }

    const handleSubmitCollectedData = async () => {
        if (formPayload) {
            const response = await post<any>('collected_data/store', formPayload, token)
            if (response?.status === 200) {
                setIsSubmitted(!isSubmitted)
                setFormPayload(null)
                setMonitoredItemState(null)
            } else {
                console.log('errorHappened')
            }
        }
    }

    const handleSetMonitoredItemState = (from: string, id: string) => {
        setMonitoredItemState({from, id})
    }

    const checkIsMonitoredItem = (from: string, id: string) => {
        let check = false
        if (from === monitoredItemState?.from && Number(id) === Number(monitoredItemState.id)) {
            check = true
        }
        return check
    }

    console.log('monitoring item', monitoredItemState)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (res.status === 200) {
                    const input = res.data.data
                    const monitoringPayload = [
                        {
                            name: `Project ${input.project.name} Outputs Monitoring`,
                            data: input.outputs,
                            type: 'outputs',
                            progress: input.output_progress
                        },
                        {
                            name: `Project ${input.project.name} Activities Monitoring`,
                            data: input.activities,
                            type: 'activities',
                            progress: input.activity_progress
                        },
                    ]

                    setPayload(monitoringPayload)
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
        // Retrieve values from local storage
        const selected_monitoring_item = getValueFromLocalStorage('selected_monitoring_item');
        const expanded_monitoring_item = getValueFromLocalStorage('expanded_monitoring_item');
        setSelected(selected_monitoring_item ?? 'outputs');
        setExpandedItem(expanded_monitoring_item);

    }, []);

    const indicatorBodyCreator = (payload: any[], parentIndex: number) => {
        if (payload.length <= 0) {
            return <p>No Indicators</p>
        }

        return <div className="flex w-full">
            <div className="border border-gray-300 flex w-full flex-col">
                <h5 className={'text-sm p-2'}>Indicators List</h5>
                <div className="w-full grid grid-cols-8 text-xs border-b border-t border-gray-300 font-semibold">
                    <p className="border-r border-gray-300 ps-2 py-2">#</p>
                    <p className="border-r border-gray-300 ps-2 py-2 ">Code</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Indicator Name</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Verify By</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Target Data</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Collected Data</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Progress </p>
                    <p className="ps-2 py-2">Action</p>
                    <p className=""></p>
                </div>
                <div>
                    {
                        payload.map((item: any, index: any) =>
                            <div key={index} className="flex ">
                                <div className="grid grid-cols-8 w-full text-xs border-b border-gray-300 ">
                                    <p className="border-r border-gray-300 ps-3  py-1">{index + 1}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.formatted_code}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.name}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.mov}</p>
                                    <p className="text-end border-r pe-3 border-gray-300 ps-2 py-1">{item.target_data}</p>
                                    <p className="text-end pe-3 border-r border-gray-300 ps-2 py-1">{item.collected_data}</p>

                                    {checkIsMonitoredItem(item.from, item.id) ?
                                        <div className="p-1 border-r border-gray-300 py-1">
                                            {/*<input type="text" placeholder="Enter Data" className={`ps-1 h-7 w-20  ${Number(parentIndex) % 2 && 'bg-gray-600'} `}*/}
                                            <input type="text"
                                                   placeholder="Enter Data"
                                                   className={`p-1 h-7 w-full bg-gray-200 border border-gray-300 shadow-md tex-black`}
                                                   onChange={(e) => handleFormInputChange(e, item, 'progress')}/>
                                        </div>
                                        :
                                        <p className="border-r border-gray-300 ps-2 py-1">{progressRender(item.progress)}</p>
                                    }

                                    {checkIsMonitoredItem(item.from, item.id) ?
                                        <div className="px-2 py-1 ">
                                            <button
                                                style={{fontSize: '10px'}}
                                                className={`h-7 w-full flex justify-center items-center px-1 text-white border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                onClick={() => handleSubmitCollectedData()}
                                            >
                                                <CircleCheckBig className="mr-1" size={12}/>
                                                Submit
                                            </button>
                                        </div>
                                        :
                                        <div className="px-2 py-1">
                                            <button
                                                style={{fontSize: '10px'}}
                                                className={`h-7 w-full flex justify-center items-center px-1 text-white  border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                onClick={() => handleSetMonitoredItemState(item.from, item.id)}
                                            >
                                                <BetweenHorizontalStart className="mr-1" size={12}/>
                                                Collect Data
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    }

    const inputBodyCreator = (payload: any[], parentIndex: number) => {

        if (payload?.length <= 0) {
            return <p>No Inputs</p>
        }

        return <div className="flex">
            <div className="w-full border border-gray-300 flex flex-col">
                <h5 className={'text-sm p-2'}>Inputs List</h5>
                <div className="">
                    <div className="grid grid-cols-7 text-xs border-b border-t border-gray-300 font-semibold">
                        <p className="border-r border-gray-300 ps-2 py-2">#</p>
                        <p className="border-r  border-gray-300 ps-2 py-2">Input Type</p>
                        <p className="border-r  border-gray-300 ps-2 py-2">Input Name</p>
                        <p className="border-r  border-gray-300 ps-2 py-2">Budget (Tzs)</p>
                        <p className="border-r   border-gray-300 ps-2 py-2">Expense (Tzs)</p>
                        <p className="border-r border-gray-300 ps-2 py-2">Utilization</p>
                        <p className="ps-2 py-2">Action</p>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        {
                            payload && payload.map((item: any, index: any) =>
                                <div key={index} className="flex flex-col ">
                                    <div className="grid grid-cols-7 w-full text-xs border-b border-gray-300 ">
                                        <p className="border-r border-gray-300 ps-2 py-1">{index + 1}</p>
                                        <p className="border-r border-gray-300 ps-2 py-1">{item.type}</p>
                                        <p className="border-r border-gray-300 ps-2 py-1">{item.name}</p>
                                        <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({
                                            amount: item.amount,
                                            isHideCurrency: true
                                        })}</p>
                                        <p className={`border-r border-gray-300 ps-2 py-1`}>{FormattedMoney({
                                            amount: item.occured_cost,
                                            isHideCurrency: true
                                        })}</p>
                                        {
                                            checkIsMonitoredItem(item.type, item.id) ?
                                                <div className="p-3 border-r border-gray-300 py-1 w-full">
                                                    <input type="text" placeholder="Enter Expense"
                                                           className={`p-1 h-7 w-full bg-gray-200 border border-gray-300 shadow-md tex-black`}
                                                           onChange={(e) => handleFormInputChange(e, item, 'cost')}/>
                                                </div>
                                                :
                                                <p className="border-r border-gray-300 ps-2 py-1">{fundProgressRender(item.utilization)}</p>
                                        }
                                        {Number(item.amount) > 0 ?
                                            <>
                                                {checkIsMonitoredItem(item.type, item.id) ?
                                                    <div className="px-2 py-1">
                                                        <button
                                                            style={{fontSize: '10px'}}
                                                            className={`h-7 w-full flex justify-center items-center px-1 text-white border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                            onClick={() => handleSubmitCollectedData()}
                                                        >
                                                            <CircleCheckBig className="mr-1" size={12}/>
                                                            Submit
                                                        </button>
                                                    </div> :
                                                    <div className="px-2 py-1">
                                                        <button
                                                            style={{fontSize: '10px'}}
                                                            className={`h-7 w-full flex justify-center px-1 items-center text-white  border border-gray-300 bg-gray-500  shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                            onClick={() => handleSetMonitoredItemState(item.type, item.id)}
                                                        >
                                                            <BetweenHorizontalStart className="me-1" size={12}/>
                                                            Collect Expense
                                                        </button>
                                                    </div>
                                                }
                                            </> :
                                            <p className={'w-full text-center'}>---</p>
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    }

    const pageRender = (payload: any, from?: string) => {
        if (payload && Object.keys(payload).length > 0 && payload.data && payload.data.length > 0) {
            return <div className="flex">
                <div className="w-full flex flex-col">
                    <div className="bg-gray-300 ">
                        <div className="flex w-full text-xs font-semibold">
                            <p className="w-[5%] border-e border-gray-400 p-2 text-start">#</p>
                            <p className="w-[15%] border-e border-gray-400 p-2 text-start">Code</p>
                            <p className="w-[20%] border-e border-gray-400 p-2 text-start">Name</p>
                            <p className="w-[17%] border-e border-gray-400 p-2 text-end">Budget (Tzs)</p>
                            <p className="w-[18%] border-e border-gray-400 p-2 text-end">Expense (Tzs)</p>
                            <p className="w-[20%] p-2 text-start">Progress</p>
                            <p className="w-[5%] p-2"></p>
                        </div>
                    </div>
                    <div className="w-full bg-white">
                        {
                            payload.data.map((item: any, index: any) =>
                                <div key={index} className={'flex w-full even:bg-gray-100 border border-gray-300 mb-2 pt-3'}>
                                    <p className={`w-[55px] h-full flex justify-center items-center ${isExpanded(item, index) && 'text-lg font-semibold'}`}>{index + 1}</p>
                                    <div className="flex w-full flex-col  border-gray-300 ">
                                        <div className="flex w-full text-xs mb-3">
                                            <p className="w-[16%] border-s border-e border-b border-t  border-gray-300 p-2 text-start">{item.formatted_code}</p>
                                            <p className="w-[21%] border-e border-b border-t  border-gray-300 p-2 text-start">{item.name}</p>
                                            <p className="w-[18%] border-e border-b border-t  border-gray-300 p-2 text-end">{FormattedMoney({
                                                amount: item.total_cost,
                                                isHideCurrency: true
                                            })}</p>
                                            <p className="w-[18.8%] border-e border-b border-t  border-gray-300 p-2 text-end">{FormattedMoney({
                                                amount: item.occured_cost,
                                                isHideCurrency: true
                                            })}</p>
                                            <p className="w-[20%] p-2 border-b border-t border-gray-300  text-start">{progressRender(item.progress)}</p>
                                            <p className={`w-[5%] p-2 border-b border-t border-e border-gray-300 `}
                                               onClick={() => handleItemExpand(index)}
                                            >
                                                {isExpanded(item, index) ?
                                                    <ChevronUp className="text-gray-900" strokeWidth={3} size={20}/> :
                                                    <ChevronDown className="text-gray-400" size={20}/>}
                                            </p>
                                        </div>
                                        <>
                                            {
                                                isExpanded(item, index) &&
                                                <div className="mb-6 pe-4 ">
                                                    {indicatorBodyCreator(item.indicators, index)}
                                                </div>
                                            }
                                            {
                                                isExpanded(item, index) && selected === 'activities' &&
                                                <div className="mb-4 pe-4">
                                                    {inputBodyCreator(item.inputs, index)}
                                                </div>
                                            }
                                        </>
                                    </div>

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
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
                                {name: 'Project Monitoring', linkTo: '/project-monitoring', permission: ''},
                                {name: 'Show', linkTo: '/projects/show', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <div className="bg-white ">
                            <div className="flex ">
                                <div className="flex flex-col w-48 mt-4 ml-4 p-2">
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
                                    </div>
                                </div>
                                <div className="flex flex-col p-4 h-full w-full bg-gray-100">
                                    {
                                        payload.map((pay, index) =>
                                            <div key={index} className="">
                                                {pay.type === selected &&
                                                    <>  {pay.data.length > 0 ?
                                                        <div key={index}
                                                             className="h-full relative bg-white shadow-md w-full p-6">
                                                            <div className="flex justify-between">
                                                                <h3 className=" text-sm font-semibold">{pay.name}</h3>
                                                                <div
                                                                    className="flex justify-center gap-3 items-center">

                                                                    <CircularWithValueLabel
                                                                        value={Number(pay.progress)}/>
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
                                                                <OctagonX/>
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