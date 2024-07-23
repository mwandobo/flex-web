"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

interface Props {
    activity_id?: any
    project_id?: any
    isHideAdd?: boolean
    prefix?: string
    isHide?: (item: string) => boolean
}

function Budget(
    {
        activity_id,
        project_id,
        isHideAdd,
        prefix
    }: Props
) {

    const columns = [
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: `${prefix} Type`,
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: `${prefix} Name`,
        },
        {
            id: 'activity',
            numeric: false,
            disablePadding: false,
            label: 'Activity Name',
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: false,
            label: 'Amount',
        },
        {
            id: 'occured_cost',
            numeric: false,
            disablePadding: false,
            label: 'Expense',
        },
    ]

    const url = `cost/${project_id}/activity/${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: [],
        url: url,
        modalTitle: 'Cost',
        viewUrl: '',
        state_properties: [],
        isHideShow: true,
        isHideActions: true
    })

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Inputs / List'
                            links={[{ name: 'Cost', linkTo: `/admnistration/external/` }]}
                            isHideAdd={isHideAdd}
                        />
                        {tabular()}
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    )
}

export default Budget