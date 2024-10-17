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
        optionsUrlData: `settings/resource`,
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
        name: 'name',
        type: 'text',
        label: 'Name',
        value: '',
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
        name: 'amount',
        type: 'text',
        label: 'Amount',
        textType: 'number',
        value: '',
        required: true,
        isError: false,
        errorMessage: '',
    },
    {
        name: 'currency_id',
        type: 'select',
        label: `Currency`,
        value: '',
        optionsUrlData: `currency`,
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: '',
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
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'ResourceName',
    },
    {
        id: 'personnel_item',
        numeric: false,
        disablePadding: false,
        label: 'Personnel / Item',
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

    const url = `resource/${project_id}/activity/${activity_id}`

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
        isHideShow: true
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