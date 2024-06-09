"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

interface Props {
    parent_id?: string
    subHeader?: string
}
function Positions({
    parent_id,
    subHeader
}: Props) {
    const permission = 'positions'

    const _deptFormInputs = [
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
            name: 'dept_id',
            type: 'select',
            label: 'Department',
            value: parent_id,
            optionsData: [{ label: 'test', value: 'value' }],
            optionsUrlData: 'department',
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: ''
        }
    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Position Name',
            width: '50%',
        },
        {
            id: 'department',
            numeric: false,
            disablePadding: false,
            label: 'Department',
            width: '44%',
        },
    ]

    const url = `${parent_id}/position`;

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Position',
        viewUrl: '/admnistration/positions/',
        state_properties: [],
        permission: permission

    })
    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {
                        loading ? <p>Loading...</p>
                            :
                            <>
                                <PageHeader
                                    handleClick={handleClick}
                                    subHeader={subHeader}
                                    links={[{ name: 'Positions / List', linkTo: '/positions', permission: '' }]}
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

export default Positions