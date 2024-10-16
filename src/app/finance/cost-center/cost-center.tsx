"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {COST_CENTER_APPROVAL_SLUG, INVOICE_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Cost Center Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'handler_id',
        type: 'select',
        label: 'Cost Handler',
        value: '',
        optionsUrlData: `/employee`,
        optionDataKey: 'users',
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
        label: 'Cost Center Code',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Cost Center Name',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Cost Center Amount ',
    },
    {
        id: 'handler_name',
        numeric: false,
        disablePadding: false,
        label: 'Handler',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function CostCenter() {
    const permission = 'invoice'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'cost-centers',
        modalTitle: 'Cost Center',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'invoices',
        isHideDelete: true,
        isHideEdit: true,
        approval_slug: COST_CENTER_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Cost Centers"}
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

export default CostCenter