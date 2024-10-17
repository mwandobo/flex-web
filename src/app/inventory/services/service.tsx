"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {COST_CENTER_APPROVAL_SLUG, INVOICE_APPROVAL_SLUG, SERVICES_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Service Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'provider',
        type: 'text',
        label: 'Service Provider',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },

    {
        name: 'cost',
        type: 'text',
        label: 'Cost',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'category',
        type: 'text',
        label: 'Category',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'start_date',
        type: 'date',
        label: 'Start Date',
        value: '',
        required: true,
        isError: false,
    },
    {
        name: 'end_date',
        type: 'date',
        label: 'End Date',
        value: '',
        required: true,
        isError: false,
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
        label: 'Service Code',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Service Name',
    },
    {
        id: 'cost',
        numeric: false,
        disablePadding: false,
        label: 'Service Cost',
    },
    {
        id: 'provider',
        numeric: false,
        disablePadding: false,
        label: 'Service Provider',
    },
    {
        id: 'formatted_start_date',
        numeric: false,
        disablePadding: false,
        label: 'Start Date',
    },
    {
        id: 'formatted_end_date',
        numeric: false,
        disablePadding: false,
        label: 'End Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Service() {
    const permission = 'service'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'services',
        modalTitle: 'Services',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'services',
        isHideDelete: true,
        isHideEdit: true,
        approval_slug: SERVICES_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Services"}
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

export default Service