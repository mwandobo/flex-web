"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    project_id?: string | null
    goal_id?: string | null
    isHideAdd?: boolean
}
function Outcome({
    project_id,
    callBackFunction,
    goal_id,
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
            label: 'Outcome Name',
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
            id: 'start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'end_date',
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

    const url = `project_outcome?project_id=${project_id}&goal_id=${goal_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Project Outcome',
        viewUrl: '/project-management/project-registration/view?id=',
        state_properties: [],
        callBackFunction: callBackFunction,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideEdit: isHideAdd,
        isHideDelete: isHideAdd
    })
    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader={`Outcomes / List`}
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

export default Outcome