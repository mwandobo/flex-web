"use client"

import {useState} from "react";
import TextFieldComponent from "@/components/inputs/text-field";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/actions/local-starage";

const RequisitionFormComponent = () => {

    const [quantity, setQuantity] = useState('')

    const onchange = (e: any, from?: any, control_for?: string) => {
        try {
            setQuantity(e.target.value)
            setValueLocalStorage('customFormData', JSON.stringify({quantity: e.target.value}));
        } catch (error: any) {
            console.log(error)
        }
    };
    return <div>
        <TextFieldComponent
            placeholder="Quantity"
            type='text'
            from="quantity"
            label="Quantity"
            value={quantity}
            onChange={onchange}
            isError={false}
            errorMessage={''}
        />
    </div>
}

export default RequisitionFormComponent