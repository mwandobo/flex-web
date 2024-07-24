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
    outcome_id?: string | null
    isHideAdd?: boolean

}
function Output({
    project_id,
    selectedViewCard,
    callBackFunction,
    outcome_id,
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
            name: 'measurement_type_id',
            type: 'select',
            label: `Means of Verification`,
            value: '',
            optionsUrlData: `settings/measurement`,
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
            label: 'Output Name',
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
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',

        },
        {
            id: 'cost',
            numeric: false,
            disablePadding: false,
            label: 'Direct Cost Budget',
        },
        {
            id: 'resource_cost',
            numeric: false,
            disablePadding: false,
            label: 'Resource Cost Budget',
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

    const url = `project_output/${project_id}/${outcome_id}`

    const { dispatch } = useGlobalContextHook()

    const planningCallbackFunction = () => {
        if (count || count === 0) {
            dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: count, for: "outputs" } })
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
        modalTitle: 'Project Output',
        viewUrl: '/project-management/projec/view?id=',
        state_properties: [],
        callBackFunction: callBackFunction,
        planningCallbackFunction: planningCallbackFunction,
        selectedViewCard: selectedViewCard,

    })
    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader={`Outputs / List`}
                            links={[]} isHideAdd={isHideAdd}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Output