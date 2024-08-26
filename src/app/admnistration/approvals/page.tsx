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
        label: 'Name',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'sys_approval_id',
        type: 'select',
        label: 'Sytem Approval',
        value: "",
        optionsUrlData: 'approval/sys',
        optionDataKey: "approvals",
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
    },
]

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Approval Name',
    },
    {
        id: 'sys_approval',
        numeric: false,
        disablePadding: false,
        label: 'System Approval Reference',
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    }
]

function Departments() {
    const permission = 'approvals'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'approval',
        modalTitle: 'Approval',
        viewUrl: '/admnistration/approvals/',
        state_properties: [],
        permission: permission
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
                                    { name: 'Approvals / List', linkTo: '/admnistration/approvals', permission: permission, isClickable: true },
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

export default Departments