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
        name: 'purpose',
        type: 'textArea',
        label: 'Description',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'control_measure',
        type: 'textArea',
        label: 'Control Measure',
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
        label: 'Risk Name',
        width: '20%',
    },
    {
        id: 'purpose',
        numeric: false,
        disablePadding: false,
        label: 'Description',
        width: '35%',
    },
    {
        id: 'control_measure',
        numeric: false,
        disablePadding: false,
        label: 'Control Measure',
        width: '35%',
    },
]

interface Props {
    activity_id?: any
    project_id?: any
    isHideAdd?: boolean

}

function Risk({
    activity_id,
    project_id,
    isHideAdd

}: Props) {

    const url = `project_risk/${project_id}/activity/${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Risk',
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
                            subHeader='Risks / List'
                            links={[{ name: 'Risk', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Risk