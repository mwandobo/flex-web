"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";

const formInputs = [
    {
        name: 'formatted_code',
        type: 'text',
        label: 'Code',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'store',
        type: 'select',
        label: 'Store',
        value: '',
        optionsUrlData: 'items-categories',
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'store_keeper',
        type: 'text',
        label: 'Store Keeper',
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
        label: 'Requisition Request Code',
        width: '20%'
    },
    {
        id: 'store_name',
        numeric: false,
        disablePadding: false,
        label: 'Store',
    },
    {
        id: 'store_keeper',
        numeric: false,
        disablePadding: false,
        label: 'Store Keeper',
    }
]

function RequisitionRequest() {
    const permission = 'requisition_request'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'requisition-request',
        modalTitle: 'Requisition Request',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'requisition-requests'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Requisition Requests"}
                                handleClick={handleClick}
                                isShowAddButton={false}
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

export default RequisitionRequest