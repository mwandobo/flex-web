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
        id: 'details',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    },
]

interface Props {
    from_id?: any
    project?: any
    from?: any
    isHideAdd?: boolean
}

function Assumption({
    from_id,
    project,
    from,
    isHideAdd

}: Props) {


    const url = `assumptions_constraints?project_id=${project?.id}&for=${from}&for_id=${from_id}&type=assumption`

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
        modalTitle: "Assumption",
        isHideDelete:isHideAdd,
        isHideEdit: isHideAdd,
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