"use client"

import ProtectedRoute from '../../../components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {DELIVERY_APPROVAL_SLUG, EQUIPMENT_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [

    {
        name: 'name',
        type: 'text',
        label: 'Equipment Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'price',
        type: 'text',
        label: 'Equipment Price',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'quantity',
        type: 'text',
        label: 'Equipment Quantity',
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
        label: 'Equipment Name',
    },
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'Serial Number',
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Price',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function Equipment() {
    const permission = 'equipment'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'equipment',
        modalTitle: 'Equipment',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'equipment',
        approval_slug: EQUIPMENT_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Equipments And Gears"}
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

export default Equipment