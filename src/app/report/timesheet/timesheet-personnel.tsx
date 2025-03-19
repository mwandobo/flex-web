"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const columns = [
    {
        id: 'full_name',
        numeric: false,
        disablePadding: false,
        label: 'Employee Name',
    },
    {
        id: 'position',
        numeric: false,
        disablePadding: false,
        label: 'Position',
    },
    {
        id: 'department',
        numeric: false,
        disablePadding: false,
        label: 'Department',
    },
]

function TimesheetPersonnel() {
    const permission = 'roles'
    const {
        loading,
        createdForm,
        handleClick,
        tabular
    } = usePageData({
        columns: columns,
        formInputs: [],
        url: 'report/timesheet/personnel',
        modalTitle: 'Role',
        viewUrl: '/report/timesheet/personnel/',
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

export default TimesheetPersonnel