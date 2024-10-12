"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Store Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'phone',
        type: 'text',
        label: 'Store Phone',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'email',
        type: 'text',
        label: 'Store Email',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'address',
        type: 'text',
        label: 'Store Address',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'keeper_id',
        type: 'select',
        label: 'Store Keeper',
        value: '',
        optionsUrlData: 'employee',
        optionDataKey: 'users',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'manager_id',
        type: 'select',
        label: 'Store Manager',
        value: '',
        optionsUrlData: 'employee',
        optionDataKey: 'users',
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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Store Name',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Store Phone',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Store Email',
    },
    {
        id: 'keeper_name',
        numeric: false,
        disablePadding: false,
        label: 'Store keeper',
    },
    {
        id: 'manager_name',
        numeric: false,
        disablePadding: false,
        label: 'Store Manager',
    }
]

function Stores() {
    const permission = 'store'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'stores',
        modalTitle: 'Store',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'store'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Stores"}
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

export default Stores