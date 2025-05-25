"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import {LESSON_APPROVAL_SLUG} from "@/utils/constant";
function Lesson() {
    const permission = 'lesson'

    const formInputs = [
        {
            name: 'project_id',
            type: 'select',
            label: `Select Project`,
            value: '',
            optionsUrlData: `project`,
            optionDataKey: 'code_name',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: ''
        },
        {
            name: 'title',
            type: 'text',
            label: 'Lesson Title',
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
            id: 'project_name',
            numeric: false,
            disablePadding: false,
            label: 'Project Name',
        },
        {
            id: 'user_name',
            numeric: false,
            disablePadding: false,
            label: 'Prepared By',
        },
        {
            id: 'formatted_created_date',
            numeric: false,
            disablePadding: false,
            label: 'Date',
        },
        {
            id: 'title',
            numeric: false,
            disablePadding: false,
            label: 'Lesson Title',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
    ]

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: formInputs,
        url: 'lesson',
        modalTitle: 'Lesson Learned',
        viewUrl: '/project-management/lessons/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        from: "lesson",
        approval_slug:LESSON_APPROVAL_SLUG
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
                                    links={[{ name: 'Lessons Learned / List', linkTo: '/project-management/lesson', permission: '' }]}
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

export default Lesson