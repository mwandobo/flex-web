"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {INVOICE_APPROVAL_SLUG} from "@/utils/constant";
import {tr} from "date-fns/locale";

const formInputs = [
    {
        name: 'type',
        type: 'select',
        label: 'Invoice Type',
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
        optionsUrlData: `/purchase-orders?approved=approved&status=invoice`,
        optionDataKey: 'rfq',
        control: 'invoice',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'invoice_date',
        type: 'date',
        label: 'Invoice Date',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'file',
        type: 'file',
        label: 'Attachment',
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
        label: 'Invoice Code',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Invoice Type',
    },
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order ',
    },
    {
        id: 'rfq_name',
        numeric: false,
        disablePadding: false,
        label: 'RFQ Name',
    },
    // {
    //     id: 'supplier_name',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Supplier',
    // },
    {
        id: 'quotation_name',
        numeric: false,
        disablePadding: false,
        label: 'Quotation',
    },
    {
        id: 'paid_amount',
        numeric: false,
        disablePadding: false,
        label: 'Paid Amount',
    },
    {
        id: 'remaining_amount',
        numeric: false,
        disablePadding: false,
        label: 'Remaining Amount',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Total Amount',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Invoice() {
    const permission = 'invoice'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'invoices',
        modalTitle: 'Invoice',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'invoices',
        isHideDelete: true,
        isHideEdit: true,
        approval_slug: INVOICE_APPROVAL_SLUG,
        isFormData:true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Invoices"}
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

export default Invoice