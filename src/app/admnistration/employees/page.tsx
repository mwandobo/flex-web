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
function Employees({
    parent_id,
    subHeader

}: Props) {

    const _deptFormInputs = [
        {
            name: 'first_name',
            type: 'text',
            label: 'First Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'middle_name',
            type: 'text',
            label: 'Middle Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'last_name',
            type: 'text',
            label: 'Last Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'email',
            type: 'text',
            label: 'Email',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'position_id',
            type: 'select',
            label: 'Position',
            value: parent_id,
            optionsUrlData: `/position`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'role_id',
            type: 'select',
            label: 'Role',
            value: parent_id,
            optionsUrlData: `/role`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'd_o_b',
            type: 'date',
            label: 'Date of Birth',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        }
    ]
    const _columns = [
        {
            id: 'full_name',
            numeric: false,
            disablePadding: false,
            label: 'Employee Name',
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Phone',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'formatted_d_o_b',
            numeric: false,
            disablePadding: false,
            label: 'Date Of Birth',
        },
        {
            id: 'department',
            numeric: false,
            disablePadding: false,
            label: 'Department',
        },
        {
            id: 'position',
            numeric: false,
            disablePadding: false,
            label: 'Position',
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: false,
            label: 'Role',
        },
    ]

    const permission = 'employees'
    const url = `/employee?position_id=${parent_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Employee',
        viewUrl: '/admnistration/employees/',
        state_properties: [],
        permission: permission,
        emailNotificationBody: { code: 'create-employee', operation: null, id: null },
        isApiV2:true,
        isMaintainViewNavigationForV1:true
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
                                    links={[{ name: 'Employees / List', linkTo: '/admnistration/employees', permission: '' }]}
                                    subHeader={subHeader}

                                />
                                {tabular()}
                                {createdForm('md')}
                            </>
                    }
                </>
            }
            </>
        </ProtectedRoute>
    )
}

export default Employees