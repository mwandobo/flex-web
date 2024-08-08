"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

const formInputs = [
    {
        name: 'element',
        type: 'textArea',
        label: 'Strategic Plan Element',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'objective',
        type: 'textArea',
        label: 'Project Business Objective',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    }
]

const columns = [
    {
        id: 'element',
        numeric: false,
        disablePadding: false,
        label: 'Strategic Plan Element',
    },

    {
        id: 'objective',
        numeric: false,
        disablePadding: false,
        label: 'Project Business Objective',
    },
]

interface Props {
    activity_id?: any
    project_id?: any
    isHideAdd?: boolean
}

function Purpose(
    {
        activity_id,
        project_id,
        isHideAdd

    }: Props
) {

    const url = `${project_id}/project_purpose`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Project Purpose',
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
                            subHeader='Project Purpose / List'
                            links={[{ name: 'Deliverable', linkTo: `/admnistration/purpose/` }]}

                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Purpose