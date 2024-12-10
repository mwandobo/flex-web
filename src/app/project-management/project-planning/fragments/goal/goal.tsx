"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { useGlobalContextHook } from '@/hooks/useGlobalContextHook'
import React, { useEffect } from 'react'
import {is} from "date-fns/locale";

interface Props {
    callBackFunction?: (selectedCard: string, id?: string) => void
    selectedViewCard?: string
    project?: any
    isHideAdd?: boolean
}
function Goal({
    project,
    selectedViewCard,
    callBackFunction,
                  isHideAdd

}: Props) {
    const _deptFormInputs = [
        {
            name: 'name',
            type: 'text',
            label: 'Goal Name',
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
            label: 'Name',
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

    const url = `project_goal?project_id=${project?.id}`

    const { dispatch } = useGlobalContextHook()

    const planningCallbackFunction = () => {
        if (count || count === 0) {
            dispatch({ type: "UPDATE_PLANNING_PAYLOAD", payload: { value: count, for: "goals" } })
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
        modalTitle: 'Project Goal',
        viewUrl: '/project-management/project-registration/view?id=',
        state_properties: [],
        callBackFunction: callBackFunction,
        selectedViewCard: selectedViewCard,
        planningCallbackFunction: planningCallbackFunction,
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
                            subHeader={`Goals / List`}
                            isHideAdd={isHideAdd}
                            links={[]} />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Goal