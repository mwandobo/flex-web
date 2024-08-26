"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'

interface Props {
    parent_id?: string
    subHeader?: string
}
function ApprovalLevel({
    parent_id,
    subHeader
}: Props) {
    const permission = 'approval_level'

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
            name: 'position_id',
            type: 'select',
            label: 'Position',
            value: '',
            optionsUrlData: 'position',
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: ''
        }
    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Approval Level Name',
            width: '50%',
        },
        {
            id: 'position',
            numeric: false,
            disablePadding: false,
            label: 'Position',
            width: '44%',
        },
    ]

    const url = `approval/${parent_id}/level`;

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Position',
        viewUrl: '/admnistration/positions/',
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
                                    subHeader={subHeader}
                                    links={[{ name: 'Approval Level / List', linkTo: '/approaval-level', permission: '' }]}
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

export default ApprovalLevel