"use client";

import React, { useState } from "react";
import MuiDate from "@/components/inputs/mui-date";
import MuiMultiSelectLocal from "@/components/inputs/mui-multi-select-local";
import {ReusableButton} from "@/components/button/reusable-button";
import { CircleCheck} from "lucide-react";

interface Props{
    from: string
}


export default function ReportFilterComponent({from}: Props) {
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string | undefined>();
    const [approval_status, setApprovalStatus] = useState<string | undefined>();

    const handleFilter = () => {
        const body = {
            from,
            items: [
                start_date && { name: 'start_date', value: start_date },
                end_date && { name: 'end_date', value: end_date },
                status && { name: 'status', value: status },
                approval_status && { name: 'approval_status', value: approval_status }
            ].filter(Boolean) // Remove null/undefined values
        };

        console.log(body)

        // You can handle API requests or parent state updates here
    };

    const areAllFieldsEmpty = () => {
        return !start_date && !end_date && !status && !approval_status;
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
    }


    return (
        <div className="w-full mb-2">
            <div className={'flex w-full mb-1'}>
                <MuiDate
                    handleDateChange={handleInputChange}
                    from={'start_date'}
                    label={"Start Date"}
                    labelStyle={"row"}
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
                    labelStyle={"row"}

                    // minDate={item.minDate}
                    // maxDate={item.maxDate}
                    // defaultValue={item.defaultDate}
                    isDisabled={false}
                />
            </div>
            <div className={'mb-2'}>
                <MuiMultiSelectLocal
                    handleChange={handleInputChange}
                    from={'status'}
                    label={"Select Status"}
                    placeholder={'Select Status'}
                    labelStyle={"row"}
                    value={''}
                    options={[
                        {label: "Pending", value: 1},
                        {label: "In-progress", value: 2}
                    ]}
                />
            </div>



            <div className={'mb-1'}>

            <MuiMultiSelectLocal
                handleChange={handleInputChange}
                from={'status'}
                label={"Select Approval Status"}
                placeholder={'Select Approval Status'}
                labelStyle={"row"}
                value={''}
                options={[
                    {label: "Pending", value: 1},
                    {label: "Approved", value: 2}
                ]}
            />
            </div>

            <div className={'flex w-full justify-end'}>
                <ReusableButton
                    name="Submit"
                    onClick={handleFilter}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                    isEndIcon={true}
                    disabled={areAllFieldsEmpty()}
                >
                    <CircleCheck size={18} />
                </ReusableButton>
            </div>



        </div>
    );
}
