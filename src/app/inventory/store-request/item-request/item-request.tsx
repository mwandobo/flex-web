"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {DELIVERY_APPROVAL_SLUG, ITEM_APPROVAL_SLUG, ITEMS_REQUESTS_APPROVAL_SLUG} from "@/utils/constant";

function ItemRequest() {

    const formInputs = [
    ]

    const columns = [
        {
            id: 'resource_name',
            numeric: false,
            disablePadding: false,
            label: 'Item Name ',
        },
        {
            id: 'quantity',
            numeric: false,
            disablePadding: false,
            label: 'Item Quantity',
        },
        {
            id: 'requester_name',
            numeric: false,
            disablePadding: false,
            label: 'Requester Name',
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


    const permission = 'delivery'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'store-requests?resource_type_id=29',
        modalTitle: 'Items Requests',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'delivery',
        isHideEdit: true,
        isHideDelete: true,
        approval_slug: ITEMS_REQUESTS_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Item Requests"}
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

export default ItemRequest