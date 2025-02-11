"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
function ProjectEvaluation() {
    const permission = 'project_monitoring'
    const _columns = [
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
            id: 'pillar',
            numeric: false,
            disablePadding: false,
            label: 'Project Pillar',
        },
        {
            id: 'formatted_start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'formatted_end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            id: 'location',
            numeric: false,
            disablePadding: false,
            label: 'Location',
        },
        {
            id: 'owner',
            numeric: false,
            disablePadding: false,
            label: 'Owner',
        },
        {
            id: 'prepared_by',
            numeric: false,
            disablePadding: false,
            label: 'Prepared By',
        },
    ]

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: [],
        url: 'project_evaluation',
        modalTitle: 'Project',
        viewUrl: '/project-management/project-evaluation/',
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
                                    links={[{ name: 'Project Evaluation / List', linkTo: '/project-management/project-evaluation', permission: '' }]}
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

export default ProjectEvaluation