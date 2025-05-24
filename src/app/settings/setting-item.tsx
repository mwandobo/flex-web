"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations'
import React from 'react'

interface Props {
    group: string
}

function SettingItem({group}: Props) {
    const columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
        },
        group === 'communication_channel' &&
        {
            id: 'location',
            numeric: false,
            disablePadding: false,
            label: 'Access Point',
        },
    ].filter(Boolean);

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
        group === 'communication_channel' &&
        {
            name: 'location',
            type: 'text',
            label: 'Access Point',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns,
        formInputs,
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
                            links={[]}
                            subHeader={`${capitalizeFirstWord(group)} Types`}
                            isHideAdd={false}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default SettingItem