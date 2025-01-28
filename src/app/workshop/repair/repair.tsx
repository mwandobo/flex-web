"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {
    REPAIR_APPROVAL_SLUG
} from "@/utils/constant";

const formInputs = [
    {
        name: 'from',
        type: 'select-local',
        label: 'Repair For',
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
        label: 'Repair Type',
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
        label: 'Repair Code',
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
        label: 'Repair Item ',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Repair Cost ',
    },
    {
        id: 'maintenance_type',
        numeric: false,
        disablePadding: false,
        label: 'Repair Type',
    },
    {
        id: 'maintained_by_name',
        numeric: false,
        disablePadding: false,
        label: 'Repaired by',
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

function Repair() {
    const permission = 'repair'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'maintenance?kind=repair',
        modalTitle: 'Repair',
        viewUrl: '/repair/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'maintenance',
        isHideDelete: false,
        isHideEdit: false,
        approval_slug: REPAIR_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Repair"}
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

export default Repair