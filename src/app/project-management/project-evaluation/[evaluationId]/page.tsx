"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import {get, post} from "@/utils/api";
import {useEffect, useState} from "react";
import LinearWithValueLabel from "@/components/bars/progressBar";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/actions/local-starage";
import {Check, ClipboardCheck, OctagonX} from "lucide-react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import swal from 'sweetalert2';
import FormattedMoney from "@/components/moneyFormater";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";

const ProjectEvaluationShow = ({params}: { params: { evaluationId: string } }) => {
    const [payload, setPayload] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.evaluationId
    const [selected, setSelected] = useState<any>()
    const {dispatch, state} = useGlobalContextHook()
    const {
        evaluationForm,
        inEvaluation
    } = state

    const progressRender = (progress?: any) => {
        if (progress === 0) {
            return <LinearWithValueLabel value={0}/>
        } else if (Number(progress) > 0) {
            return <LinearWithValueLabel value={Number(progress)}/>

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
        const form = evaluationForm.data.map(item => {
            return {...item, value: ''}
        })
        dispatch({type: 'UPDATE_EVALUATION_FORM', payload: form})
        setValueLocalStorage('evaluation_form', JSON.stringify(form))
        dispatch({type: 'UPDATE_IN_EVALUATION', payload: !inEvaluation})
    }

    const handleEvaluationItemChange = (item: string) => {
        setSelected(item)
        setValueLocalStorage('selected_evaluation_item', item)
    }

    const handleCollectAction = async () => {
        dispatch({type: 'UPDATE_IN_EVALUATION', payload: !inEvaluation})
    }

    const handleFormInputChange = (e: any, body: any, from: string, type?: string) => {

        const newPayload = evaluationForm.data.map(item => {
            switch (from) {
                case 'progress':
                    if (item.id.toString() === body.id.toString() && !item.parent) {
                        return {...item, value: e.target.value}
                    }
                    return item;
                case 'cost':
                    if (item.for === type && item.id.toString() === body.id.toString() && item.parent) {

                        return {...item, value: e.target.value}
                    }
                    return item;
                default:
                    break;
            }
        })

        setValueLocalStorage('evaluation_form', JSON.stringify(newPayload))
        dispatch({type: 'UPDATE_EVALUATION_FORM', payload: newPayload})
    }

    const handleSubmit = async () => {
        if (evaluationForm) {
            if (validator()) {
                const newForm = {project_id: id, ...evaluationForm}
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
                    text: "You Have Not Filled All The Inputs, Or Data is Not Clean Please Try Again",
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

    const validator = () =>
        evaluationForm.data.every(
            (item: any) => !isNaN(item.value) && item.value > 0
        );

    const url = `project_evaluation/show/${id}`
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)
                if (res.status === 200) {
                    const input = res.data.data;
                    const evaluationPayload = [
                        {
                            name: `Project ${input.project.name} Goals Evaluation`,
                            data: input.goals, type: 'goal', progress: input.goals_progress
                        },
                        {
                            name: `Project ${input.project.name} Outcomes Evaluation`,
                            data: input.outcomes,
                            type: 'outcome',
                            progress: input.outcomes_progress
                        },
                    ]
                    setPayload(evaluationPayload)

                    const allIndicators = input.all_indicators

                    if (allIndicators && allIndicators.length > 0) {
                        let newFormPayload = allIndicators.map(item => {
                            return {id: item.id, value: '', for: item.from, parent: item.parent}
                        })

                        const evaluationForm = getValueFromLocalStorage('evaluation_form')
                        const form = JSON.parse(evaluationForm)
                        if (form && form.length > 0) {
                            dispatch({type: 'UPDATE_EVALUATION_FORM', payload: newFormPayload})
                        } else {
                            dispatch({type: 'UPDATE_EVALUATION_FORM', payload: newFormPayload})
                        }
                    }

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
    }, [isSubmitted])

    useEffect(() => {
        // Retrieve values from local storage
        const _inEvaluation = getValueFromLocalStorage('inEvaluation');
        dispatch({type: 'UPDATE_IN_EVALUATION', payload: _inEvaluation})
        const selected_evaluation_item = getValueFromLocalStorage('selected_evaluation_item');
        setSelected(selected_evaluation_item ?? 'goal');

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
                    <p className="border-r border-gray-300 ps-2 py-2">Baseline Data</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Target Data</p>
                    <p className="border-r border-gray-300 ps-2 py-2">Collected Data</p>
                    <p className="ps-2 py-2">Evaluation Data</p>
                </div>
                <div>
                    {
                        payload.map((item: any, index: any) =>
                            <div key={index} className="flex ">
                                <div
                                    className={`grid grid-cols-8 w-full text-xs ${index !== payload.length - 1 && 'border-b border-gray-200'} `}>
                                    <p className="border-r border-gray-300 ps-3  py-1">{index + 1}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.formatted_code}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.name}</p>
                                    <p className="border-r border-gray-300 ps-3 py-1">{item.mov}</p>
                                    <p className="text-end border-r pe-3 border-gray-300 ps-2 py-1">{item.baseline_data}</p>
                                    <p className="text-end pe-3 border-r border-gray-300 ps-2 py-1 ">{item.target_data}</p>
                                    <p className="text-end pe-3 border-r border-gray-300 ps-2 py-1 ">{item.collected_data}</p>
                                    {
                                        !inEvaluation ?
                                            <p className={'w-full text-center'}>waiting...</p> :
                                            <div className={'w-full p-1'}>
                                                <input type="text" placeholder="Enter Evaluated Data"
                                                       value={valueFinder(item.id, 'progress')}
                                                       className={`h-7 p-1 w-full bg-gray-200 border border-gray-300 shadow-md tex-black`}
                                                       onChange={(e) => handleFormInputChange(e, item, 'progress')}/>
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

    const inputBodyCreator = (item: any, from: string) => {

        if (!item) {
            return <p>No Inputs</p>
        }

        return <div className="flex w-full">
            <div className="w-full border border-gray-300 flex flex-col">
                <div className="font-semibold text-sm py-2 ps-2"><h5>Input Evaluation</h5></div>

                <div className="">
                    <div className="grid grid-cols-4 text-xs border-b border-t border-gray-300 font-semibold">
                        <p className="border-r border-gray-300 ps-2 py-2">Direct Cost (Tzs)</p>
                        <p className="border-r border-gray-300 ps-2 py-2">Resource Cost (Tzs)</p>
                        <p className="border-r border-gray-300 ps-2 py-2">Total Cost (Tzs)</p>
                        <p className="ps-2 py-2">{inEvaluation && 'Evaluated'} Expense</p>
                    </div>
                </div>
                <div className="">
                    <div className="">

                        <div className="flex flex-col ">
                            <div className="grid grid-cols-4 w-full text-xs border-b border-gray-300 ">
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({
                                    amount: item.cost,
                                    isHideCurrency: true
                                })}</p>
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({
                                    amount: item.resource_cost,
                                    isHideCurrency: true
                                })}</p>
                                <p className="border-r border-gray-300 ps-2 py-1">{FormattedMoney({
                                    amount: item.total_cost,
                                    isHideCurrency: true
                                })}</p>
                                <div className="text-end border-r border-gray-300 p-1">
                                    {
                                        inEvaluation && Number(item.total_cost) > 0 ?
                                            <input type="text" placeholder="Enter Evaluated Expense"
                                                   value={valueFinder(item.id, 'cost', from)}
                                                   className={`p-1 h-7 w-full bg-gray-200 border border-gray-300 shadow-md tex-black`}
                                                   onChange={(e) => handleFormInputChange(e, item, 'cost', from)}/>
                                            :
                                            <p className="text-end">{FormattedMoney({
                                                amount: item.occured_cost,
                                                isHideCurrency: true
                                            })}</p>
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
            return <div className="flex w-full">
                <div className="w-full flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="min-w-[750px]">
                            <div className="bg-gray-300 ">
                                <div className="flex w-full text-xs font-semibold">
                                    <p className="w-[5%] border-e border-gray-400 p-2 text-start">#</p>
                                    <p className="w-[15%] border-e border-gray-400 p-2 text-start">Code</p>
                                    <p className="w-[21%] border-e border-gray-400 p-2 text-start">Name</p>
                                    <p className="w-[18%] border-e border-gray-400 p-2 text-end">Budget (Tzs)</p>
                                    <p className="w-[19%] border-e border-gray-400 p-2 text-end">Expense (Tzs)</p>
                                    <p className="w-[23%] p-2 text-start">Progress</p>

                                    <p className="w-[5%]  p-2"></p>
                                </div>
                            </div>
                            <div className="w-full bg-white">
                                {
                                    payload.data.map((item: any, index: any) =>
                                        <div key={index}
                                             className={'flex w-full even:bg-gray-100 border border-gray-300 mb-2 pt-3'}>
                                            <p className={`w-[55px] h-full flex justify-center items-center ${inEvaluation && 'text-lg font-semibold'}`}>{index + 1}</p>
                                            <div className="flex w-full flex-col  border-gray-300 ">
                                                <div className="flex w-full text-xs mb-3">
                                                    <p className="w-[14.8%] border-s border-e border-b border-t  border-gray-300 p-2 text-start">{item.formatted_code}</p>
                                                    <p className="w-[20.8%] border-e border-b border-t  border-gray-300 p-2 text-start">{item.name}</p>
                                                    <p className="w-[18%] border-e border-b border-t  border-gray-300 p-2 text-end">{FormattedMoney({
                                                        amount: item.total_cost,
                                                        isHideCurrency: true
                                                    })}</p>
                                                    <p className="w-[18.8%] border-e border-b border-t  border-gray-300 p-2 text-end">{FormattedMoney({
                                                        amount: item.occured_cost,
                                                        isHideCurrency: true
                                                    })}</p>
                                                    <p className="w-[26%] p-2 border-b border-t border-e border-gray-300  text-start">{progressRender(item.progress)}</p>
                                                </div>
                                                <div className={'mb-2 pe-4'}>
                                                    {
                                                        inEvaluation &&
                                                        <div className="mb-6 ">
                                                            {indicatorBodyCreator(item.indicators, index)}
                                                        </div>
                                                    }
                                                    {inEvaluation &&
                                                        < div className="">
                                                            {inputBodyCreator(item, from)}
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    }

    const evaluationItems = ['goal', 'outcome'];


    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col w-full">
                        <PageHeader
                            links={[
                                {name: 'Project Evaluation', linkTo: '/project-evaluation', permission: ''},
                                {name: 'Show', linkTo: '/projects/show', permission: ''},
                            ]}
                            isShowPage={true}
                        />
                        <div className="flex h-full w-full">
                            <div className="flex flex-col md:flex-row w-full text-xs p-2">
                                <div className="basis-[14%] font-semibold mb-4">
                                    <h4 className="text-sm  mb-2">Evaluation Items</h4>
                                    <div className="flex flex-col gap-1 cursor-pointer">
                                        {evaluationItems.map(item => (
                                            <p
                                                key={item}
                                                className={`p-1 hover:bg-sidebar-background hover:text-sidebar-active ${
                                                    selected === item && 'bg-sidebar-background text-sidebar-active'
                                                }`}
                                                onClick={() => handleEvaluationItemChange(item)}
                                            >
                                                {`${capitalizeFirstWord(item)}s`}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="flex justify-end">
                                        {
                                            !buttonActive() &&
                                            <button
                                                className={`border flex items-center text-sm text-white  border-gray-300 px-2 py-1 ${inEvaluation ? 'bg-gray-400' : 'bg-gray-500 '} shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                onClick={() => handleSubmit()}
                                                disabled={buttonActive()}
                                            >
                                                Submit
                                            </button>
                                        }
                                    </div>
                                </div>

                                <div className="basis-[86%] bg-gray-200 p-2">
                                    <div className="bg-white p-2 w-full">                                    {
                                        payload.map((pay, index) =>
                                            <div key={index} className="w-full">
                                                {pay.type === selected &&
                                                    <>  {pay.data.length > 0 ?

                                                        <div key={index}
                                                             className="h-full  w-full">
                                                            <div className="flex w-full justify-between">
                                                                <h3 className="p-1 font-semibold">{pay.name}</h3>
                                                                <div
                                                                    className=" p-2">
                                                                    <button
                                                                        className={`border flex items-center text-sm text-white  border-gray-300 px-2 py-1 ${inEvaluation ? 'bg-gray-400' : 'bg-gray-500 '} shadow-md hover:shadow-lg transition-shadow duration-300`}
                                                                        onClick={() => handleCollectAction()}
                                                                    >
                                                                        {inEvaluation ?
                                                                            <Check size={10} className="mr-1"/> :
                                                                            <ClipboardCheck size={15}
                                                                                            className="mr-1"/>}
                                                                        {inEvaluation ? 'Exit Evaluating' : 'Evaluate'}
                                                                    </button>

                                                                </div>
                                                            </div>
                                                            {pay.data?.length > 0 && pageRender(pay, pay.type)}
                                                        </div>
                                                        :
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
                    </div>
            }
        </ProtectedRoute>
    );
};

export default ProjectEvaluationShow;