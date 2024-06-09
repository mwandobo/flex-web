"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { useGlobalContextHook } from '@/hooks/useGlobalContextHook'
import React, { useEffect } from 'react'

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    selectedViewCard?: string
    project_id?: string | null
    project?: any
    activity_id?: string | null
    isHideAdd?: boolean

}
function Task({
    project_id,
    selectedViewCard,
    callBackFunction,
    activity_id,
    isHideAdd,
    project

}: Props) {
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
            name: 'assumption',
            type: 'textArea',
            label: 'Assumption',
            value: '',
            required: true,
            isError: false,
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
        },
    ]

    const _columns = [
        {
            id: 'formatted_code',
            numeric: false,
            disablePadding: false,
            label: 'Code',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Task Name',
        },
        {
            id: 'project',
            numeric: false,
            disablePadding: false,
            label: 'Project',
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
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
        {
            id: 'cost',
            numeric: false,
            disablePadding: false,
            label: 'Direct Cost',
        },
        {
            id: 'resource_cost',
            numeric: false,
            disablePadding: false,
            label: 'Resource Cost',
        },
        {
            id: 'total_cost',
            numeric: false,
            disablePadding: false,
            label: 'Total Cost',
        },
        {
            id: 'progress_status',
            numeric: false,
            disablePadding: false,
            label: 'Status',
        }
    ]

    const url = `project_task/${project_id}/${activity_id}`

    const { dispatch } = useGlobalContextHook()

    const planningCallbackFunction = () => {
        if (count || count === 0) {
            dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: count, for: "tasks" } })
        }
    }

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
        count
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Project Task',
        viewUrl: '/project-management/project-planning/view?id=',
        state_properties: [],
        callBackFunction: callBackFunction,
        planningCallbackFunction: planningCallbackFunction,
        selectedViewCard: selectedViewCard

    })
    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader={`Tasks / List`}
                            links={[]}
                            isHideAdd={isHideAdd}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Task