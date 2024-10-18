"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {
    DELIVERY_APPROVAL_SLUG,
    FINANCE_APPROVAL_SLUG,
    ITEM_APPROVAL_SLUG,
    SERVICE_REQUESTS_APPROVAL_SLUG
} from "@/utils/constant";

const formInputs = [

]

const columns = [
    {
        id: 'requester_name',
        numeric: false,
        disablePadding: false,
        label: 'Name of Requester',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Requested Amount',
    },
    {
        id: 'formatted_requested_date',
        numeric: false,
        disablePadding: false,
        label: 'Requested Date',
    },
    {
        id: 'formatted_dispatched_date',
        numeric: false,
        disablePadding: false,
        label: 'Dispatched Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function FinanceRequest() {
    const permission = 'finance-request'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'finance-requests',
        modalTitle: 'Finance Requests',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'finance-requests',
        isHideEdit: true,
        isHideDelete: true,
        approval_slug: FINANCE_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Finance Request"}
                                handleClick={handleClick}
                                isShowAddButton={false}
                               />
                            {tabular()}
                            {createdForm()}
                        </>
                    }
                </>
            }
            </>

        </ProtectedRoute>
    )
}

export default FinanceRequest