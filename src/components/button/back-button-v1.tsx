
"use client"

import { ArrowLeftSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReusableButton } from "./reusable-button";
import {setValueLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

const BackButton = () => {
    const { dispatch} = useGlobalContextHook()

    const handleNavigateBack = () => {
        setValueLocalStorage('sub_view_item', JSON.stringify({id: '', from: ''}))
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: {id: '', from: ''}})
    };

    return (
        <div>
            <ReusableButton
                name="Back"
                onClick={handleNavigateBack}>
                <ArrowLeftSquare size={13} />
            </ReusableButton>
        </div>
    )
}

export default BackButton