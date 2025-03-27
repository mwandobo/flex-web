"use client";

import React, { useState } from "react";
import MuiDate from "@/components/inputs/mui-date";
import MuiMultiSelectLocal from "@/components/inputs/mui-multi-select-local";
import {ReusableButton} from "@/components/button/reusable-button";
import { CircleCheck} from "lucide-react";

export default function ReportFilterComponent() {
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string | undefined>();
    const [approval_status, setApprovalStatus] = useState<string | undefined>();

    const handleFilter = () => {
        console.log({ start_date, end_date, status, approval_status });
        // You can handle API requests or parent state updates here
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
            >
                <CircleCheck size={18} />
            </ReusableButton>

        </div>
    );
}
