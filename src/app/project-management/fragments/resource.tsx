"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

const formInputs = [
    {
        name: 'resource_type_id',
        type: 'select',
        label: `Select Resource Type`,
        value: '',
        optionsUrlData: `settings?group=resource`,
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
        control_for: 'resource'
    },
    {
        name: 'personnel_id',
        type: 'select',
        label: `Select Personnel`,
        value: '',
        optionsUrlData: `/employee`,
        optionDataKey: 'users',
        required: true,
        isError: false,
        errorMessage: '',
        isRemoved: true,
    },
    {
        name: 'item_id',
        type: 'select',
        label: `Select Item`,
        value: '',
        optionsUrlData: `/item?approved=approved`,
        optionDataKey: 'quotation-item',
        required: true,
        isError: false,
        errorMessage: '',
        isRemoved: true,
    },
    {
        name: 'service_id',
        type: 'select',
        label: `Select Service`,
        value: '',
        optionsUrlData: `/services?approved=approved`,
        optionDataKey: 'quotation-item',
        required: true,
        isError: false,
        errorMessage: '',
        isRemoved: true,
    },
    {
        name: 'quantity',
        type: 'text',
        label: 'Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: '',
        isRemoved: true,
    },
    {
        name: 'details',
        type: 'textArea',
        label: 'Description',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    }
]

const columns = [
    {
        id: 'resource_type_name',
        numeric: false,
        disablePadding: false,
        label: 'Resource Type',
    },
    {
        id: 'resource_name',
        numeric: false,
        disablePadding: false,
        label: 'Resource Name',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Quantity',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'details',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    },
]

interface Props {
    activity_id?: any
    project_id?: any
    isHideAdd?: boolean
}

function Resource({
    activity_id,
    project_id,
    isHideAdd
}: Props) {

    const url = `resource?project_id=${project_id}&for=activity&for_id=${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular
    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Resource',
        viewUrl: '',
        state_properties: [],
        isHideShow: true,
        isApiV2:true
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Resources / List'
                            links={[{ name: 'Resource', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}

                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Resource