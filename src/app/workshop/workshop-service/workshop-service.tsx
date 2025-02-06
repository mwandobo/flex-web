"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {
    REPAIR_APPROVAL_SLUG, WORKSHOP_SERVICE_REQUEST_APPROVAL_SLUG
} from "@/utils/constant";

const formInputs = [
    {
        name: 'service_request_type',
        type: 'select-local',
        label: 'Service Request Type',
        value: '',
        optionsUrlData: [{label: 'Internal', value: 'internal'},{label: 'External', value: 'external'}],
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control_for: 'workshop_service',
    },
    {
        name: 'from',
        type: 'select-local',
        label: 'Service Request For',
        value: '',
        optionsUrlData: [{label: 'Item', value: 'item'},{label: 'Equipment', value: 'equipment'}],
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control_for: 'from_id',
        isRemoved: 'from_id'
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
        control: 'from_id',
        isRemoved: true
    },
    {
        name: 'item_id',
        type: 'select',
        label: 'Items',
        value: '',
        optionsUrlData: 'items',
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        isRemoved: 'true'
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
    {
        name: 'amount',
        type: 'text',
        label: 'Amount',
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
        label: 'Workshop Request Code',
    },
    {
        id: 'service_request_type',
        numeric: false,
        disablePadding: false,
        label: 'Service Type',
    },
    {
        id: 'item_name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Cost ',
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

function WorkshopService() {
    const permission = 'workshop-service'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'workshop-service',
        modalTitle: 'Workshop Service',
        viewUrl: '/workshop-service/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'workshop-service',
        isHideDelete: false,
        isHideEdit: false,
        approval_slug: WORKSHOP_SERVICE_REQUEST_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Workshop Service"}
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

export default WorkshopService