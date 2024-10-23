"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {CUSTOMER_APPROVAL_SLUG, REQUEST_FOR_QUOTATION_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Customer Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'email',
        type: 'text',
        label: 'Customer Email',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'phone',
        type: 'text',
        label: 'Customer Phone',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'address',
        type: 'text',
        label: 'Customer Address',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]


const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Customer Email',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Customer Phone',
    },
    {
        id: 'address',
        numeric: false,
        disablePadding: false,
        label: 'Customer Address',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Customer() {
    const permission = 'customers'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'customers',
        modalTitle: 'Customer',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'rfq',
        approval_slug: CUSTOMER_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Customers"}
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

export default Customer