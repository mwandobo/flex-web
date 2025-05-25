"use client";

import React, {useEffect, useState} from "react";
import MuiDate from "@/components/inputs/mui-date";
import MuiMultiSelectLocal from "@/components/inputs/mui-multi-select-local";
import {ReusableButton} from "@/components/button/reusable-button";
import {BadgeX, CircleCheck, RefreshCcwDot, X} from "lucide-react";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import MuiSelectLocal from "@/components/inputs/mui-select-local";
import MuiMultiSelectSelect from "@/components/inputs/mui-multi-select";

interface Props {
    from: string,
    isHideDateFilter?: boolean,
    statusBody?: {
        label: string,
        value: number,
    }[],
    isApprovalFilter?: boolean
    byProject?: boolean
}

export default function ReportFilterComponent({
                                                  from,
                                                  statusBody,
                                                  isApprovalFilter,
                                                  isHideDateFilter,
                                                  byProject
                                              }: Props) {
    const {dispatch, state} = useGlobalContextHook();
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string | undefined>();
    const [approval_status, setApprovalStatus] = useState<number | undefined>();
    const [project_ids, setProjectIds] = useState<number[] | undefined>();
    const filter = state.filter;

    const handleFilter = () => {
        const body = {
            from,
            items: [
                start_date && {name: 'start_date', value: start_date},
                end_date && {name: 'end_date', value: end_date},
                status && {name: 'status', value: status},
                approval_status && {name: 'approval_status', value: approval_status},
                project_ids && {name: 'project_ids', value: project_ids}
            ].filter(Boolean) // Remove null/undefined values
        };

        console.log(body)

        dispatch({type: 'SET_FILTER_BODY', payload: body})
    };

    const handleClear = () => {

        dispatch({type: 'SET_FILTER_BODY', payload: ''})
    };

    const areAllFieldsEmpty = () => {
        return !start_date && !end_date && !status && !approval_status && !project_ids;
    };

    const handleInputChange = (e: any, from?: any) => {
        if (from === 'start_date') {
            setStartDate(e.target.value)
        }
        if (from === 'end_date') {
            setEndDate(e.target.value)
        }
        if (from === 'status') {
            setStatus(e.target.value)
        }
        if (from === 'approvalStatus') {
            setApprovalStatus(e.target.value)
        }
        if (from === 'project_ids') {
            console.log('form e', e.target)

            setProjectIds(e.target.value)
        }
    }

    const handleFilters = () =>{
        dispatch({type: "UPDATE_APPLY_FILTERS", payload: ''})
        handleClear()
    }

    const updateValues = () => {
        const filter = getValueFromLocalStorage('filter');
        if (!filter) return;

        dispatch({type: 'UPDATE_APPLY_FILTERS', payload: filter})

        let filtered_data = getValueFromLocalStorage('filters');

        if (!filtered_data) return;
        filtered_data = JSON.parse(filtered_data);

        if (filtered_data.from !== from) return;

        // Ensure t
        if (filtered_data) {
            const items = filtered_data.items
            const start_date_object = items.find(item => item.name === 'start_date')
            if (start_date_object) {
                setStartDate(start_date_object.value)
            }

            const end_date_object = items.find(item => item.name === 'end_date')
            if (end_date_object) {
                setEndDate(end_date_object.value)
            }

            const status = items.find(item => item.name === 'status')
            if (status) {
                setStatus(status.value)
            }

            const project = items.find(item => item.name === 'project_ids')
            if (project) {
                setProjectIds(project.value)
            }

            const approvalStatus = items.find(item => item.name === 'approval_status')

            if (approvalStatus) {
                setApprovalStatus(approvalStatus.value)
            }
        }
    }


    useEffect(() => {

        updateValues()
    }, [filter ])

    return (<>
            {filter && filter === from &&
                <div className={'w-full mb-6 flex justify-end  p-2 '}>
                    <div className="w-1/2 border border-gray-100 p-2 flex flex-col items-end">
                        <button onClick={handleFilters} className={'mb-3'}>
                            <BadgeX size={18} strokeWidth={2} className={'text-gray-700'}/>
                        </button>
                        {!isHideDateFilter &&
                            <div className={'flex w-full mb-1'}>
                                <MuiDate
                                    handleDateChange={handleInputChange}
                                    from={'start_date'}
                                    label={"Start Date"}
                                    labelStyle={"row"}
                                    isSmall={true}
                                    value={start_date}
                                    // minDate={item.minDate}
                                    // maxDate={item.maxDate}
                                    // defaultValue={item.defaultDate}
                                    isDisabled={false}
                                />
                                <MuiDate
                                    handleDateChange={handleInputChange}
                                    from={'end_date'}
                                    label={"End Date"}
                                    value={end_date}
                                    isSmall={true}
                                    labelStyle={"row"}
                                    // minDate={item.minDate}
                                    // maxDate={item.maxDate}
                                    // defaultValue={item.defaultDate}
                                    isDisabled={false}
                                />
                            </div>
                        }
                        {statusBody && statusBody.length > 0 &&
                            <div className={'mb-2 w-full'}>
                                <MuiMultiSelectLocal
                                    handleChange={handleInputChange}
                                    from={'status'}
                                    label={"Select Status"}
                                    placeholder={'Select Status'}
                                    labelStyle={"row"}
                                    isSmall={true}
                                    value={status}
                                    options={
                                        statusBody.map((item, index) => {
                                            return {label: item.label, value: item.value}
                                        })
                                    }
                                />
                            </div>
                        }
                        {isApprovalFilter &&
                            <div className={'w-full'}>
                                <MuiSelectLocal
                                    handleChange={handleInputChange}
                                    from={'approvalStatus'}
                                    label={"Select Approval Status"}
                                    placeholder={'Select Approval Status'}
                                    labelStyle={"row"}
                                    isSmall={true}
                                    value={approval_status}
                                    optionsUrlData={[
                                        {label: "Pending", value: '1'},
                                        {label: "Approved", value:'2'},
                                        {label: "DisApproved", value: '3'}
                                    ]}
                                />
                            </div>
                        }
                        {byProject &&
                            <div className={'mb-2 w-full'}>
                                <MuiMultiSelectSelect
                                    handleChange={handleInputChange}
                                    optionsUrlData={`project`}
                                    optionDataKey= {'code_name'}
                                    from={'project_ids'}
                                    label={"Select Projects"}
                                    placeholder={'Select Projects'}
                                    labelStyle={"row"}
                                    isSmall={true}
                                    value={status}
                                />
                            </div>
                        }

                        <div className={'flex w-full justify-between'}>
                            <ReusableButton
                                name="Clear Filters"
                                onClick={handleClear}
                                rounded={'md'}
                                padding={'p-2'}
                                shadow={'shadow-md'}
                                bg_color={'bg-gray-50'}
                                hover={'hover:bg-gray-200 hover:border-gray-400'}
                                hover_text={'hover:text-gray-900 hover:font-semibold'}
                                border={'border border-gray-300'}
                                text_color={'text-gray-700'}
                                isEndIcon={false}
                                disabled={false}
                            >
                                <RefreshCcwDot size={18}/>
                            </ReusableButton>
                            <ReusableButton
                                name="Submit"
                                onClick={handleFilter}
                                rounded={'md'}
                                padding={'p-2'}
                                shadow={'shadow-md'}
                                bg_color={'bg-gray-50'}
                                hover={'hover:bg-gray-200 hover:border-gray-400'}
                                hover_text={'hover:text-gray-900 hover:font-semibold'}
                                border={'border border-gray-300'}
                                text_color={'text-gray-700'}
                                isEndIcon={false}
                                disabled={areAllFieldsEmpty()}
                            >
                                <CircleCheck size={18}/>
                            </ReusableButton>
                        </div>
                    </div>

                </div>
            }
        </>
    );
}
