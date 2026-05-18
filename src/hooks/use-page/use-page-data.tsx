"use client"

import * as React from "react";
import {ReactNode, useEffect, useState} from "react";
import {baseURL, get} from "@/utils/api";
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
    isFormData?: boolean,
    sliderComponent?: any,
    tablePaginationType?: 'front-end' | 'back-end'
}

export const usePageData = ({
                                columns,
                                formInputs,
                                url,
                                modalTitle,
                                viewUrl,
                                state_properties,
                                callBackFunction,
                                addPriceFormInputData,
                                itHasCustomForm,
                                customForm,
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
                                approval_slug,
                                sliderComponent,
                                tablePaginationType = 'back-end'
                            }: Props
) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any[]>([])
    const token = getValueFromLocalStorage('token', null)
    const [page, setPage] = React.useState(1);
    const [totalRecords, setTotalRecords] = React.useState(0);
    const [filterKey, setFilterKey] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const router = useRouter()
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const updatePage = (page: number) => {
        setPage(page)
    }

    const updateRowsPerPage = (rowsPerPage: number) => {
        setRowsPerPage(rowsPerPage);
        setPage(0);
    };

    const updateFilterKey = (filterKey: string) => {
        setFilterKey(filterKey);
    };

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
        callBackFunction,
        emailNotificationBody,
        from,
        isApiV2,
        isMaintainViewNavigationForV1,
        itHasCustomForm: itHasCustomForm,
        customForm: customForm,
        isFormData,
        sliderComponent
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
        page,
        rowsPerPage,
        filterKey,
        updateRowsPerPage,
        updatePage,
        updateFilterKey,
        totalRecords,
        tablePaginationType
    })

    const ensureURL = (url: string, baseURL: string) => {
        try {
            // If `url` is absolute, this will work directly
            return new URL(url);
        } catch {
            // Else it's a relative URL, make sure baseURL ends with `/`
            const safeBase = baseURL.endsWith('/') ? baseURL : baseURL + '/';
            const safePath = url.startsWith('/') ? url.slice(1) : url;
            return new URL(safePath, safeBase);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                const parsedUrl = ensureURL(url, baseURL);

                // Update/add new query parameters
                parsedUrl.searchParams.set('page', page.toString());
                parsedUrl.searchParams.set('limit', rowsPerPage.toString());
                if (filterKey) {
                    parsedUrl.searchParams.set('q', filterKey);
                } else {
                    parsedUrl.searchParams.delete('q'); // remove if empty
                }

                const finalUrl = parsedUrl.toString();
                const res = await get(finalUrl)
                if (res.status === 200) {
                    await gracefulApprovalUpdater(from, approval_slug)
                    setData(res.data.data)
                    if (res.data?.pagination?.total) {
                        setTotalRecords(res.data?.pagination?.total)
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
    }, [rowsPerPage, filterKey, page, url, isStateChanged])

    return {
        loading,
        tabular,
        createdForm,
        handleClick,
        data,
        totalRecords,
        isStateChanged,
        page,
        rowsPerPage,
        updatePage,
        updateRowsPerPage,
    }
}