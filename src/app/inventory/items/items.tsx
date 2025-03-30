"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {ITEM_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Item Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'category_id',
        type: 'select',
        label: 'Item Category',
        value: '',
        optionsUrlData: 'items-categories?approved=approved',
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'price',
        type: 'text',
        label: 'Item price',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'quantity',
        type: 'text',
        label: 'Quantity',
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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
    },
    {
        id: 'category_name',
        numeric: false,
        disablePadding: false,
        label: 'Item Category',
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Item Price',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Item Quantity',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    }
]

function Items() {
    const permission = 'item'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'item',
        modalTitle: 'Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'item',
        approval_slug: ITEM_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Items"}
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

export default Items