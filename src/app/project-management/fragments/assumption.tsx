"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

const formInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'collection_method',
        type: 'text',
        label: 'Collection Method',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'frequency',
        type: 'text',
        label: 'Frequency and Schedule',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'responsibilities',
        type: 'text',
        label: 'Responsibilities',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'audience',
        type: 'text',
        label: 'Information Use / Audience',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
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
        label: 'Assumption Name',
    },
    {
        id: 'collection_method',
        numeric: false,
        disablePadding: false,
        label: 'Collection Method',
    },
    {
        id: 'frequency',
        numeric: false,
        disablePadding: false,
        label: 'Frequency',
    },
    {
        id: 'responsibilities',
        numeric: false,
        disablePadding: false,
        label: 'Responsibilities',
    },
    {
        id: 'audience',
        numeric: false,
        disablePadding: false,
        label: 'Audience',
    },
    {
        id: 'details',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    },
]

interface Props {
    from_id?: any
    project_id?: any
    from?: any
    isHideAdd?: boolean
}

function Assumption({
    from_id,
    project_id,
    from,
    isHideAdd

}: Props) {

    const url = `assumptions_contsraints/${project_id}/${from}/${from_id}/assumption`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        url: url,
        isHideShow: true,
        state_properties: [],
        formInputs: formInputs,
        modalTitle: "Assumption"
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Assumptions / List'
                            links={[{ name: 'Assumption & Constraint', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}

                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Assumption