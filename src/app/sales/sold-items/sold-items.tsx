"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {ITEM_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
]

const columns = [
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
    },
    {
        id: 'category_name',
        numeric: false,
        disablePadding: false,
        label: 'Item Category',
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Item Price',
    },
    {
        id: 'rfq_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Item Quantity',
    },
    {
        id: 'warrant_status',
        numeric: false,
        disablePadding: false,
        label: 'Warranty Status',
    },
]

function SoldItems() {
    const permission = 'sold-items'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'purchase-orders/sold-items',
        modalTitle: 'Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'item',
        // approval_slug: ITEM_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Sold Items"}
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

export default SoldItems