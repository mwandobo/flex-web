"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'
import TaskView from "@/app/project-management/timesheet-management/fragments/task-view";

interface Props {
    activity?: any
}

function Task({
                        activity,
                    }: Props) {
    const formInputs = [
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
            name: 'assignment_type_id',
            type: 'select',
            label: `Select Type of Assignment`,
            value: '',
            optionsUrlData: `settings?group=assignment`,
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
            optionsUrlData: `/employee`,
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
            minDate: activity?.start_date,
            maxDate: activity?.end_date,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            minDate: activity?.start_date,
            maxDate: activity?.end_date,
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
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Task Name',
        },
        {
            id: 'personnel_department',
            numeric: false,
            disablePadding: false,
            label: 'Personnel/Department',
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

    const url = `task?project_id=${activity?.project_id}&activity_id=${activity?.id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Task',
        viewUrl: '',
        state_properties: [],
        isHideShow: false,
        isApiV2: true,
        sliderComponent:TaskView
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Task / List'
                            links={[{ name: 'Task', linkTo: `/admnistration/external/` }]}
                        />

                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Task