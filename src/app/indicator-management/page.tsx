"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'


interface Props {
    from?: string | null
    from_id?: string | null
    means_of_verification?: string | null
    project_id?: string | null
    isHideAdd?: boolean

}

function Page({
    from,
    from_id,
    project_id,
    means_of_verification,
    isHideAdd

}: Props) {


    const formInputs = [

    ]

    const columns = [
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
            label: 'Indicator Name',
        },
        {
            id: 'project_name',
            numeric: false,
            disablePadding: false,
            label: 'Project Name',
        },
        {
            id: 'formatted_from',
            numeric: false,
            disablePadding: false,
            label: 'From',
            isHidden: ['output', 'activity', 'goal', 'outcome'].includes(from)
        },
        {
            id: 'mov',
            numeric: false,
            disablePadding: false,
            label: 'Means of verification',
        },
        {
            id: 'baseline_data',
            numeric: false,
            disablePadding: false,
            label: 'Baseline Data',
            isHidden: ['output', 'activity'].includes(from)
        },
        {
            id: 'target_data',
            numeric: false,
            disablePadding: false,
            label: 'Target Data',
        },
        {
            id: 'collected_data',
            numeric: false,
            disablePadding: false,
            label: 'Collected Data',
        },

        {
            id: 'progress',
            numeric: false,
            disablePadding: false,
            label: 'Progress',
        },
    ]


    const url = `indicator?project_id=${project_id}&from=${from}&from_id=${from_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Indicator',
        viewUrl: '/indicator-management/',
        state_properties: [],
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideEdit: true
    })


    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Indicators / List'
                            links={[{ name: 'Indicator', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}
                        />
                        {tabular()}
                        {createdForm('md')}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Page