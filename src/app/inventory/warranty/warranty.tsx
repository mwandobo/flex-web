"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import {usePageData} from '@/hooks/use-page/use-page-data'
import {checkPermissions} from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {
    COST_CENTER_APPROVAL_SLUG,
    INVOICE_APPROVAL_SLUG,
    SERVICES_APPROVAL_SLUG,
    WARRANTY_APPROVAL_SLUG
} from "@/utils/constant";
import {from} from "stylis";


interface Props {
    from?: string,
    from_id?: string,
}

interface ColumnInputProps {
    id: string,
    numeric: boolean,
    disablePadding: boolean,
    label: string,
    isHidden?: boolean
}

function Warranty({
                      from,
                      from_id
                  }: Props) {
    const permission = 'service'
    const formInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Warranty Name',
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
            name: 'terms',
            type: 'textArea',
            label: 'Terms',
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

        {
            name: 'file',
            type: 'file',
            label: 'Warranty Document',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const columns: ColumnInputProps[] = [
        {
            id: 'formatted_code',
            numeric: false,
            disablePadding: false,
            label: 'Warranty Code',
        },
        {
            id: 'service_item_name',
            numeric: false,
            disablePadding: false,
            label: 'Service / Item',
            isHidden: !!(from && from_id)
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
            id: 'terms',
            numeric: false,
            disablePadding: false,
            label: 'Terms',
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        },
    ]


    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `warranties?from=${from}&from_id=${from_id}`,
        modalTitle: 'Warranty',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        from: 'services',
        isHideDelete: true,
        isHideEdit: true,
        approval_slug: WARRANTY_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Warranties"}
                                handleClick={handleClick}
                                isShowAddButton={!!(from && from_id)}
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

export default Warranty