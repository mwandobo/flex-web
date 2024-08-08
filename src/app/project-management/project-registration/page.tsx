"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
function Project() {
    const permission = 'projects'

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
            name: 'pillar',
            type: 'text',
            label: 'Project Pillar',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },

        // {
        //     name: 'type_id',
        //     type: 'select',
        //     label: `Project Type`,
        //     value: '',
        //     optionsUrlData: `settings/project`,
        //     optionDataKey: 'departments',
        //     required: true,
        //     isError: false,
        //     errorMessage: ''
        // },
        {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'location',
            type: 'text',
            label: 'Location',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'owner',
            type: 'text',
            label: 'Owner',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'prepared_by',
            type: 'text',
            label: 'Prepared By',
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
        },
        {
            name: 'summary',
            type: 'textArea',
            label: 'Summary',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'purpose',
            type: 'textArea',
            label: 'Purpose',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'scope',
            type: 'textArea',
            label: 'Scope',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

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
        {
            id: 'progress_status',
            numeric: false,
            disablePadding: false,
            label: 'Prrogress',
        },
    ]

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: 'project',
        modalTitle: 'Project',
        viewUrl: '/project-management/project-registration/',
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
                                    links={[{ name: 'Projects / List', linkTo: '/project-management/project-registration', permission: '' }]}
                                />
                                {tabular()}
                                {createdForm(2)}
                            </>
                    }
                </>
            }
            </>
        </ProtectedRoute>
    )
}

export default Project