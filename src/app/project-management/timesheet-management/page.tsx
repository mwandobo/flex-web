"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const deptFormInputs = [

]

const columns = [
    {
        id: 'formatted_name',
        numeric: false,
        disablePadding: false,
        label: 'Project Name',
        // width: '94%',
    },
    {
        id: 'formatted_start_date',
        numeric: false,
        disablePadding: false,
        label: 'Start Date',
        // width: '94%',
    },
    {
        id: 'formatted_end_date',
        numeric: false,
        disablePadding: false,
        label: 'End Date',
        // width: '94%',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        // width: '94%',
    },
]

function Timesheet() {

    const permission = 'timesheet'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: deptFormInputs,
        url: 'timesheet',
        modalTitle: 'Role',
        viewUrl: '/project-management/timesheet-management',
        state_properties: [],
        permission: permission,
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
                                    links={[{ name: 'Timesheet - Projects / List', linkTo: '/role', permission: '' }]}
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

export default Timesheet