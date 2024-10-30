"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const deptFormInputs = [
    {
        name: 'name',
        type: 'text',
        label: 'Pricing Name',
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
        label: 'Pricing Name',
        width: '94%',
    },
]

function Pricing() {
    const permission = 'departments'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'pricing',
        modalTitle: 'Department',
        viewUrl: '/admnistration/departments/',
        state_properties: [],
        permission: permission,
        isApiV2: true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                handleClick={handleClick}
                                links={[
                                    { name: 'Departments / List', linkTo: '/admnistration/departments', permission: permission, isClickable: true },
                                ]} />
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

export default Pricing