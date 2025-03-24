
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
                onClick={handleNavigateBack}
                rounded={'md'}
                padding={'p-2'}
                shadow={'shadow-md'}
                bg_color={'bg-gray-50'}
                hover={'hover:bg-gray-200 hover:border-gray-400'}
                hover_text={'hover:text-gray-900 hover:font-semibold'}
                border={'border border-gray-300'}
                text_color={'text-gray-700'}

            >


                <ArrowLeftSquare size={13} />
            </ReusableButton>
        </div>
    )
}

export default BackButton