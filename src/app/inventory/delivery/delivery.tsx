"use client"

import ProtectedRoute from '../../../components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {DELIVERY_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'type',
        type: 'select',
        label: 'Order Type',
        value: '',
        optionsUrlData: `/invoices/types`,
        optionDataKey: 'invoice-type',
        control_for: 'invoice',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'purchase_order_id',
        type: 'select',
        label: 'Purchase Order',
        value: '',
        optionsUrlData: `invoices/purchase-orders`,
        optionDataKey: 'rfq',
        control: 'invoice',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'delivery_cost',
        type: 'text',
        label: 'Delivery Cost',
        value: '0',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'delivery_date',
        type: 'date',
        label: 'Delivery Date',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'delivery_address',
        type: 'text',
        label: 'Delivery Address',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'description',
        type: 'textArea',
        label: 'Description',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'Delivery Code',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order ',
    },
    {
        id: 'quotation_name',
        numeric: false,
        disablePadding: false,
        label: 'Quotation',
    },
    {
        id: 'delivery_cost',
        numeric: false,
        disablePadding: false,
        label: 'Delivery Cost',
    },
    {
        id: 'formatted_delivery_date',
        numeric: false,
        disablePadding: false,
        label: 'Delivery Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Delivery() {
    const permission = 'delivery'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'deliveries',
        modalTitle: 'Delivery',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'delivery',
        approval_slug: DELIVERY_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Deliveries"}
                                handleClick={handleClick}
                                isShowAddButton={true}
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

export default Delivery