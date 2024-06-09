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
        name: 'description',
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
        label: 'Deliverable Name',
    },

    {
        id: 'description',
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

function Deliverable(
    {
        activity_id,
        project_id,
        isHideAdd

    }: Props
) {

    const url = `deliverable/${project_id}/activity/${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Deliverable',
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
                            subHeader='Deliverables / List'
                            links={[{ name: 'Deliverable', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}

                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Deliverable