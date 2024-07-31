"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

const columns = [
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Code',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Project Name',
    },
    {
        id: 'formatted_start_date',
        numeric: false,
        disablePadding: false,
        label: 'Start Date',
    },
    {
        id: 'formatted_end_date',
        numeric: false,
        disablePadding: false,
        label: 'End Date',
    },
]

function ProjectCharter() {
    const permission = 'roles'
    const {
        loading,
        createdForm,
        handleClick,
        tabular
    } = usePageData({
        columns: columns,
        formInputs: [],
        url: 'reports/project-charter',
        modalTitle: 'Role',
        viewUrl: '/report/project-charter/',
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
                                    links={[{ name: 'Reports / Project Charter / List', linkTo: '/report/project-charter', permission: '' }]}
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

export default ProjectCharter