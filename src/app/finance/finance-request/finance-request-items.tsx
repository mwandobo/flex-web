"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [
    {
        name: 'delivery_quantity',
        type: 'text',
        label: 'Delivery Quantity',
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
        label: 'Requisition Quantity',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Purchased Quantity',
    },
    {
    id: 'delivery_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Delivered Quantity',
    }
]

interface Props {
    delivery: any
}

function FinanceRequestItems({delivery}: Props) {
    const permission = 'delivery_item'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `deliveries/${delivery?.id}/bids`,
        modalTitle: 'Delivery Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'delivery-items',
        isHideShow: true,
        isHideDelete: true,
        isHideEdit: delivery?.status !== 'pending'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Delivery Items"}
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

export default FinanceRequestItems