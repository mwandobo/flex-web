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
        label: 'Supplier Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'email',
        type: 'text',
        label: 'Supplier Email',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'phone',
        type: 'text',
        label: 'Supplier Phone',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'address',
        type: 'text',
        label: ' Supplier Address',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'category_ids',
        type: 'multi-select',
        label: 'Supplier Category',
        value: '',
        optionsUrlData: 'items-categories',
        optionDataKey: 'supplier-items-category',
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
        label: 'Supplier Name',
    },
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'supplier Email',
    },
    {
        id: 'phone',
        numeric: false,
        disablePadding: false,
        label: 'Supplier Phone',
    },
    {
        id: 'category_name',
        numeric: false,
        disablePadding: false,
        label: 'Supplier Categories',
    },
]

function Suppliers() {
    const permission = 'supplier'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'suppliers',
        modalTitle: 'Supplier',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'supplier'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Suppliers"}
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

export default Suppliers