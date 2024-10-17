"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations'
import React from 'react'
function ExternalUsers() {
    const group = getValueFromLocalStorage('group')

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
    ]
    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
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
        url: `settings?group=${group}`,
        modalTitle: `${capitalizeFirstWord(group)} Settings`,
        viewUrl: `/settings/${group}/view?id=`,
        state_properties: [group],
        isHideShow: true,
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
                            links={[{ name: capitalizeFirstWord(group), linkTo: `/settings/${group}`, permission: '' }]}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default ExternalUsers