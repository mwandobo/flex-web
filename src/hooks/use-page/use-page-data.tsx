"use client"

import { useState, useEffect } from "react";
import { get } from "@/utils/api";
import { useCrudOperator } from "../crud/crud-operator";
import { usePopulateTable } from "../data-populate/populate-table";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { useRouter } from "next/navigation";

interface Props {
    columns: any[]
    formInputs?: any[]
    url: string
    modalTitle: string
    viewUrl: string
    isFormLoading?: boolean
    state_properties: any[]
    callBackFunction?: (selectedCard: string, id?: string) => void
    planningCallbackFunction?: () => void
    selectedViewCard?: string
    show_assign?: boolean
    permission?: string;
    isHideShow?: boolean;
    isHideDelete?: boolean;
    isHideEdit?: boolean;
}

export const usePageData = ({
    columns,
    formInputs,
    url,
    modalTitle,
    viewUrl,
    state_properties,
    callBackFunction,
    planningCallbackFunction,
    selectedViewCard,
    show_assign,
    permission,
    isHideShow,
    isHideDelete,
    isHideEdit
}: Props

) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [count, setCount] = useState<any>()

    const token = getValueFromLocalStorage('token', null)

    const router = useRouter()

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        handleClick,
        createdForm,
        isStateChanged
    } = useCrudOperator({
        formInputData: formInputs,
        incomingUrl: url,
        incomingModalTitle: modalTitle,
        viewUrl: viewUrl,
        state_properties: state_properties,
        selectedViewCard: selectedViewCard,
        callBackFunction: callBackFunction,
    })

    const { tabular } = usePopulateTable({
        columns: columns,
        data: data,
        handleClick: handleClick,
        show_assign: show_assign,
        permission,
        isHideShow,
        isHideDelete,
        isHideEdit
    })


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    if (res.data.count) {
                        setCount(res.data.count)
                    }

                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
                }
            }
        };
        fetchData()
    }, [isStateChanged, ...state_properties])


    useEffect(() => {
        planningCallbackFunction && planningCallbackFunction()
    }, [data])

    return {
        loading,
        tabular,
        createdForm,
        handleClick,
        data,
        count
    }
}