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
        label: 'Select Type',
        options: [
            { value: 'assumption', label: 'Assumption' },
            { value: 'constraint', label: 'Constraint' },
        ],
        type: 'radio',
        name: 'type',
        value: '',
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
        width: '30%',
    },
    {
        id: 'details',
        numeric: false,
        disablePadding: false,
        label: 'Description',
        width: '65%',
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

    const url = `assumptions_contsraints/${project_id}/${from}/${from_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Assumption/Constraint',
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
                            subHeader='Assumptions & Constraints / List'
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