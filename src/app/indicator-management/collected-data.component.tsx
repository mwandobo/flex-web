"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations'
import React, { useEffect, useState } from 'react'

interface Props {
    indicator_id: any
}

function CollectedData({indicator_id}: Props ) {

    const _deptFormInputs = [
        {
            name: 'indicator_id',
            type: 'select',
            label: `Select Indicator`,
            value: '',
            optionsUrlData: `indicator`,
            optionDataKey: 'indicators',
            required: true,
            isError: false,
            errorMessage: '',
        },
        {
            name: 'name',
            type: 'text',
            label: 'Name',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
        },
        {
            name: 'quantity',
            type: 'text',
            label: 'Quantity',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
        }
    ]

    const _columns = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Data Name',
        },
        {
            id: 'quantity',
            numeric: false,
            disablePadding: false,
            label: 'Collected Data',
        },
    ]

    const url = `collected_data?indicator_id=${indicator_id}`
    const permission = 'indicator'

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: 'Collected Data',
        viewUrl: '/indicator-management/',
        state_properties: [],
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideShow: true
    })

    return (
        <ProtectedRoute>
            <>
                {
                        loading ? <p>Loading...</p>
                            :
                            <>
                                <PageHeader
                                    handleClick={handleClick}
                                    links={[{ name: "Collected Data / List", linkTo: `/admnistration/external/` }]}
                                />
                                {tabular()}
                                {createdForm()}
                            </>
                }
                </>
        </ProtectedRoute>
    )
}

export default CollectedData