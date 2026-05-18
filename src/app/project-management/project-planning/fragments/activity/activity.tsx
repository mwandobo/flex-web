"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    project_id?: string | null
    project?: any
    output_id?: string | null
    isHideAdd?: boolean
}

function Activity({
    project_id,
    callBackFunction,
    output_id,
    project,
    isHideAdd
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
            name: 'measurement_type_id',
            type: 'select',
            label: `Means of Verification`,
            value: '',
            optionsUrlData: `settings?group=measurement`,
            optionDataKey: 'departments',
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
            label: 'Activity Name',
        },
        {
            id: 'project',
            numeric: false,
            disablePadding: false,
            label: 'Project',
        },
        {
            id: 'mov',
            numeric: false,
            disablePadding: false,
            label: 'Means Of Verification',
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
            id: 'total_cost',
            numeric: false,
            disablePadding: false,
            label: 'Total Cost Budget',
        },
        {
            id: 'progress',
            numeric: false,
            has_progressStatus: true,
            disablePadding: false,
            label: 'Progress (%)',
        },
    ]

    const url = `activity?project_id=${project_id}&output_id=${output_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Project Activity',
        viewUrl: '/project-management/project-planning/view?id=',
        state_properties: [],
        callBackFunction: callBackFunction,
        isMaintainViewNavigationForV1: true,
        isHideEdit: isHideAdd,
        isHideDelete: isHideAdd,
        isApiV2:true
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader={`Activities / List`}
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

export default Activity