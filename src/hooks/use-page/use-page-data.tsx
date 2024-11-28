"use client"

import {useState, useEffect, ReactNode} from "react";
import {get} from "@/utils/api";
import {useCrudOperator} from "../crud/crud-operator";
import {usePopulateTable} from "../data-populate/populate-table";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useRouter} from "next/navigation";
import {gracefulApprovalUpdater} from "@/utils/actions/update-approvals.helper";

interface Props {
    columns?: any[]
    formInputs?: any[]
    isShowAddPriceButton?: boolean
    addPriceFormInputData?: any[]
    url?: string
    modalTitle?: string
    viewUrl?: string
    isFormLoading?: boolean
    state_properties?: any[]
    callBackFunction?: (selectedCard: string, id?: string) => void
    planningCallbackFunction?: () => void
    selectedViewCard?: string
    show_assign?: boolean
    permission?: string;
    isHideShow?: boolean;
    isHideDelete?: boolean;
    isHideEdit?: boolean;
    isCreateAndSend?: string;
    emailNotificationBody?: any,
    isHideActions?: boolean
    tableData?: any[]
    from?: string
    approval_slug?: string
    isApiV2?: boolean
    isMaintainViewNavigationForV1?: boolean
    itHasCustomForm?: boolean
    customForm?: ReactNode;
    isFormData?: boolean
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
                                addPriceFormInputData,
                                itHasCustomForm,
                                customForm,
                                selectedViewCard,
                                isFormData,
                                show_assign,
                                permission,
                                isHideShow,
                                isHideDelete,
                                isHideEdit,
                                isShowAddPriceButton,
                                emailNotificationBody,
                                isHideActions,
                                tableData,
                                from,
                                isApiV2,
                                isMaintainViewNavigationForV1,
                                approval_slug
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
        formInputData: isShowAddPriceButton ? addPriceFormInputData : formInputs,
        isShowAddPriceButton,
        incomingUrl: url,
        incomingModalTitle: modalTitle,
        viewUrl,
        state_properties,
        selectedViewCard,
        callBackFunction,
        emailNotificationBody,
        from,
        isApiV2,
        isMaintainViewNavigationForV1,
        itHasCustomForm: itHasCustomForm,
        customForm: customForm,
        isFormData
    })

    const {tabular} = usePopulateTable({
        columns: columns,
        data: data,
        handleClick: handleClick,
        show_assign: show_assign,
        permission,
        isHideShow,
        isHideDelete,
        isHideEdit,
        isHideActions,
        isShowAddPriceButton,
        from,
        approval_slug,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    await gracefulApprovalUpdater(from, approval_slug)
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

        if (tableData?.length > 0) {
            setData(tableData)
        } else {
            fetchData()
        }
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
        count,
        isStateChanged
    }
}