"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {INSPECTION_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [

    {
        name: 'delivery_id',
        type: 'select',
        label: 'Delivery',
        value: '',
        optionsUrlData: `/deliveries?approved=approved&status=delivered`,
        optionDataKey: 'rfq',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'inspected_by',
        type: 'text',
        label: 'Inspected By',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'inspection_cost',
        type: 'text',
        label: 'Inspection Cost',
        value: '0',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'inspection_date',
        type: 'date',
        label: 'Inspection Date',
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
        label: 'Inspection Code',
    },
    {
        id: 'delivery_name',
        numeric: false,
        disablePadding: false,
        label: 'Delivery Code ',
    },
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order ',
    },
    {
        id: 'supplier_name',
        numeric: false,
        disablePadding: false,
        label: 'Supplier',
    },
    {
        id: 'quotation_name',
        numeric: false,
        disablePadding: false,
        label: 'Quotation',
    },
    {
        id: 'inspection_cost',
        numeric: false,
        disablePadding: false,
        label: 'Inspection Cost',
    },
    {
        id: 'formatted_inspection_date',
        numeric: false,
        disablePadding: false,
        label: 'Inspection Date',
    },
    {
        id: 'inspected_by',
        numeric: false,
        disablePadding: false,
        label: 'Inspected By',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Inspection() {
    const permission = 'inspection'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'inspections',
        modalTitle: 'Inspection',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'inspection',
        approval_slug: INSPECTION_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Inspections"}
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

export default Inspection