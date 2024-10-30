"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [
    {
        name: 'price',
        type: 'text',
        label: 'Item Price',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'item_name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
        width: '20%'
    },
    {
        id: 'item_price',
        numeric: false,
        disablePadding: false,
        label: 'Item Price',
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Price',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'RFQ Quantity',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Quantity',
    }
]

interface Props {
    purchase_order_id: string
}

function PurchaseOrderItems({purchase_order_id}: Props) {
    const permission = 'purchase_order_item'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `purchase-orders/${purchase_order_id}/items`,
        modalTitle: 'Quotation Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'purchase-order-items',
        isHideShow: true,
        isHideDelete: true,
        isHideEdit: true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Purchase Order Items"}
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

export default PurchaseOrderItems