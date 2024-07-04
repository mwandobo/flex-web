"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

interface Props {
    activity_id?: any
    project?: any
    isHideAdd?: boolean
}

function Assignment({
    activity_id,
    project,
    isHideAdd
}: Props) {

    const formInputs = [
        {
            name: 'assignment_type_id',
            type: 'select',
            label: `Select Type of Assignment`,
            value: '',
            optionsUrlData: `settings/assignment`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: 'assignment'
        },
        {
            name: 'personnel_id',
            type: 'select',
            label: `Select Personnel`,
            value: '',
            optionsUrlData: `/undefined/employee`,
            optionDataKey: 'users',
            required: true,
            isError: false,
            isRemoved: true,
            errorMessage: ''
        },
        {
            name: 'dept_id',
            type: 'select',
            label: `Select Department`,
            value: '',
            optionsUrlData: `department`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            isRemoved: true,
            errorMessage: ''
        },
        {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            minDate: project?.start_date,
            maxDate: project?.end_date,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            minDate: project?.start_date,
            maxDate: project?.end_date,
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
            id: 'personnel_department',
            numeric: false,
            disablePadding: false,
            label: 'Personnel/Department',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
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





    const url = `task_assignment/${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Assignment',
        viewUrl: '',
        state_properties: [],
        isHideShow: true
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Assignments / List'
                            links={[{ name: 'Assignment', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}
                        />

                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Assignment