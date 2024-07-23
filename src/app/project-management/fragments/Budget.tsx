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

                        <div className='flex flex-col items-end w-full'>
                            <div className='flex flex-col items-end border border-gray-100 p-2'>
                                <h4 className='text-start w-full'>Summary</h4>
                                <div className=''>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'></p>
                                        <p className='ml-3'>Amount</p>
                                        <p className=''>Expense</p>
                                    </div>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'>Total Direct Budget:</p>
                                        <p className='ml-3'>130000</p>
                                        <p className='ml-2'>130000</p>
                                    </div>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'>Total Resource Budget:</p>
                                        <p className='ml-3'>130000</p>
                                        <p className='ml-2'>130000</p>
                                    </div>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'>Total Budget:</p>
                                        <p className='ml-3'>130000</p>
                                        <p className='ml-2'>130000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </ProtectedRoute>
    )
}

export default Budget