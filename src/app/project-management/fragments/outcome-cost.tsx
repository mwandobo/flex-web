"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'

interface Props {
    activity_id?: any
    outcomes?: any
    project?: any
    isHideAdd?: boolean
    prefix?: string
}

function OutcomeCost(
    {
        activity_id,
        outcomes,
        project,
        isHideAdd,
        prefix
    }: Props
) {

    const columns = [
        {
            id: 'formatted_name',
            numeric: false,
            disablePadding: false,
            label: `Outcome Name`,
        },
        {
            id: 'total_cost',
            numeric: false,
            disablePadding: false,
            label: `Budget`,
        },
        {
            id: 'occured_cost',
            numeric: false,
            disablePadding: false,
            label: 'Expense',
        },
    ]

    const url = `outcome/by-project/${project?.id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
        data

    } = usePageData({
        columns: columns,
        formInputs: [],
        url: url,
        modalTitle: 'Cost',
        viewUrl: '',
        state_properties: [outcomes.length],
        isHideShow: true,
        isHideActions: true
    })

    const calculator = () => {

        let totalResourceCost = 0;
        let totalDirectCost = 0;
        let totalResourceOccuredCost = 0;
        let totalDirectOccuredCost = 0;
        if (data.length > 0) {
            data.forEach(element => {
                totalResourceCost += Number(element.resource_cost)
                totalDirectCost += Number(element.cost)
                totalResourceOccuredCost += Number(element.resource_occured_cost)
                totalDirectOccuredCost += Number(element.direct_occured_cost)
            });
        }

        const grandTotalCost = totalResourceCost + totalDirectCost
        const grandTotalOccuredCost = totalResourceOccuredCost + totalDirectOccuredCost

        return {
            totalResourceCost,
            totalDirectCost,
            totalResourceOccuredCost,
            totalDirectOccuredCost,
            grandTotalCost,
            grandTotalOccuredCost

        }
    }


    const {
        totalResourceCost,
        totalDirectCost,
        totalResourceOccuredCost,
        totalDirectOccuredCost,
        grandTotalCost,
        grandTotalOccuredCost
    } = calculator()


    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            handleClick={handleClick}
                            subHeader='Costs / List'
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
                                        <p className='ml-3'>{totalDirectCost}</p>
                                        <p className='ml-3'>{totalDirectOccuredCost}</p>
                                    </div>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'>Total Resource Budget:</p>
                                        <p className='ml-3'>{totalResourceCost}</p>
                                        <p className='ml-3'>{totalResourceOccuredCost}</p>
                                    </div>
                                    <div className='grid grid-cols-3 text-xs'>
                                        <p className='text-end'>Total Budget:</p>
                                        <p className='ml-3'>{grandTotalCost}</p>
                                        <p className='ml-3'>{grandTotalOccuredCost}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </ProtectedRoute>
    )
}

export default OutcomeCost