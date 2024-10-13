"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import {usePageData} from '@/hooks/use-page/use-page-data'
import {checkPermissions} from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {ITEM_CATEGORY_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Category Name',
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
        label: 'Category Name',
    },
    {
        id: 'total_items',
        numeric: false,
        disablePadding: false,
        label: 'Total Items',
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    }
]

function ItemsCategories() {
    const permission = 'item_category'

    const {
        loading,
        createdForm,
        handleClick,
        tabular
    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'items-categories',
        modalTitle: 'Items Category',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        from: 'items-categories',
        approval_slug: ITEM_CATEGORY_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Item Categories"}
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

export default ItemsCategories