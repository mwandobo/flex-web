"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {COST_CENTER_APPROVAL_SLUG, INVOICE_APPROVAL_SLUG, MAINTENANCE_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'from',
        type: 'select-local',
        label: 'Maintenance For',
        value: '',
        optionsUrlData: [{label: 'Item', value: 'item'},{label: 'Equipment', value: 'equipment'}],
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control_for: 'from_id'
    },
    {
        name: 'from_id',
        type: 'select',
        label: 'Equipment',
        value: '',
        optionsUrlData: 'maintenance/items',
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control: 'from_id'
    },
    {
        name: 'maintenance_type',
        type: 'select-local',
        label: 'Maintenance Type',
        value: '',
        optionsUrlData: [{label: 'Internal', value: 'internal'},{label: 'External', value: 'external'}],
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control_for: 'maintenance_items'
    },
    {
        name: 'name',
        type: 'text',
        label: 'Enter Name of Technician',
        value: '',
        required: true,
        isError: false,
        isRemoved: true,
        errorMessage: ''
    },
    {
        name: 'maintained_by_id',
        type: 'select',
        label: 'Select Name of Technician',
        value: '',
        optionsUrlData: 'employee',
        optionDataKey: 'users',
        required: true,
        isError: false,
        isRemoved: true,
        errorMessage: '',
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
        label: 'Maintenance Code',
    },
    {
        id: 'from',
        numeric: false,
        disablePadding: false,
        label: 'Item Type',
    },
    {
        id: 'maintenance_item_name',
        numeric: false,
        disablePadding: false,
        label: 'Maintenance Item ',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Maintenance Cost ',
    },
    {
        id: 'maintenance_type',
        numeric: false,
        disablePadding: false,
        label: 'Maintenance Type',
    },
    {
        id: 'maintained_by_name',
        numeric: false,
        disablePadding: false,
        label: 'Maintained by',
    },
    {
        id: 'warranty_status',
        numeric: false,
        disablePadding: false,
        label: 'Warranty Status',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Maintenance() {
    const permission = 'maintenance'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'maintenance?kind=maintenance',
        modalTitle: 'Maintenance',
        viewUrl: '/maintenance/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'maintenance',
        isHideDelete: false,
        isHideEdit: false,
        approval_slug: MAINTENANCE_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Maintenance"}
                                handleClick={handleClick}
                                isShowAddButton={true}
                               />
                            {tabular()}
                            {createdForm('md')}
                        </>
                    }
                </>
            }
            </>

        </ProtectedRoute>
    )
}

export default Maintenance