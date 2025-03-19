"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Department Name',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function TimesheetDepartment() {
    const permission = 'roles'
    const {
        loading,
        createdForm,
        handleClick,
        tabular
    } = usePageData({
        columns: columns,
        formInputs: [],
        url: 'report/timesheet/department',
        modalTitle: 'Role',
        viewUrl: '/report/timesheet/department/',
        state_properties: [],
        permission: permission,
        isHideDelete: true,
        isHideEdit: true
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
                                    links={[{ name: 'Reports / Timesheet / List', linkTo: '/report/timesheet', permission: '' }]}
                                    isHideAdd={true}
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

export default TimesheetDepartment