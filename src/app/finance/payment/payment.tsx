"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";

const formInputs = [
    {
        name: 'invoice_id',
        type: 'select',
        label: 'Invoice',
        value: '',
        optionsUrlData: `/invoices`,
        optionDataKey: 'rfq',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'amount',
        type: 'text',
        label: 'Amount',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'payment_date',
        type: 'date',
        label: 'Payment Date',
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
        label: 'Payment Code ',
    },
    {
        id: 'invoice_name',
        numeric: false,
        disablePadding: false,
        label: 'Invoice',
    },
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Amount',
    },
]

function Payment() {
    const permission = 'payment-list'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'payments',
        modalTitle: 'payment',
        viewUrl: '/payment/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'payment'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Payments"}
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

export default Payment