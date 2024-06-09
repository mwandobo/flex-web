"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations'
import React, { useEffect, useState } from 'react'

function CollectedData() {

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
            // width: '50%',
        },
        {
            id: 'indicator',
            numeric: false,
            disablePadding: false,
            label: 'Indicator',
            // width: '50%',
        },

        {
            id: 'baseline_data',
            numeric: false,
            disablePadding: false,
            label: 'baseline_data',
            // width: '50%',
        },
        {
            id: 'target_data',
            numeric: false,
            disablePadding: false,
            label: 'Target Data',
            // width: '50%',
        },

        {
            id: 'quantity',
            numeric: false,
            disablePadding: false,
            label: 'Collected Data',
            // width: '50%',
        },

    ]

    const url = 'collected_data'
    const permission = 'data'

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: `Collected Data`,
        viewUrl: `/indicator-management/`,
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
                                    links={[{ name: "Collected Data / List", linkTo: `/admnistration/external/` }]}
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

export default CollectedData