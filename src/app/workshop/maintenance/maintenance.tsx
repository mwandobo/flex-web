"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {COST_CENTER_APPROVAL_SLUG, INVOICE_APPROVAL_SLUG, MAINTENANCE_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'role_id',
        type: 'select',
        label: 'Maintenance For',
        value: '',
        optionsUrlData: 'role',
        optionDataKey: 'departments',
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
        label: 'Maintenance Code',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Cost Center Amount ',
    },
    {
        id: 'maintained_by_name',
        numeric: false,
        disablePadding: false,
        label: 'Maintained by',
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
        url: 'maintenance',
        modalTitle: 'Maintenance',
        viewUrl: '/maintenance/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'maintenance',
        isHideDelete: true,
        isHideEdit: true,
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
                            {createdForm()}
                        </>
                    }
                </>
            }
            </>

        </ProtectedRoute>
    )
}

export default Maintenance