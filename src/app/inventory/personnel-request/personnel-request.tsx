"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {
    DELIVERY_APPROVAL_SLUG,
    ITEM_APPROVAL_SLUG,
    PERSONNEL_REQUESTS_APPROVAL_SLUG,
    SERVICE_REQUESTS_APPROVAL_SLUG
} from "@/utils/constant";

const formInputs = [

]

const columns = [
    {
        id: 'resource_name',
        numeric: false,
        disablePadding: false,
        label: 'Personnel Name',
    },
    {
        id: 'requester_name',
        numeric: false,
        disablePadding: false,
        label: 'Name of Requester',
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

function StoreRequest() {
    const permission = 'delivery'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'store-requests?resource_type_id=23',
        modalTitle: 'Personnel Requests',
        viewUrl: '/personnel-request/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'service-requests',
        isHideEdit: true,
        isHideDelete: true,
        approval_slug: PERSONNEL_REQUESTS_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Personnel Request"}
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

export default StoreRequest