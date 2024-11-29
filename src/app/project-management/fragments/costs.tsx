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

function Cost(
    {
        activity_id,
        project_id,
        isHideAdd,
    }: Props
) {

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
        {
            name: 'amount',
            type: 'text',
            label: 'Amount (Tzs)',
            textType: 'number',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        // {
        //     name: 'currency_id',
        //     type: 'select',
        //     label: `Select Currency`,
        //     value: '',
        //     optionsUrlData: `currency`,
        //     optionDataKey: 'departments',
        //     required: true,
        //     isError: false,
        //     errorMessage: ''
        // },
        {
            name: 'purpose',
            type: 'textArea',
            label: 'Description',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        }
    ]

    const columns = [

        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: `Cost Name`,
        },
        {
            id: 'purpose',
            numeric: false,
            disablePadding: false,
            label: 'Description',
        },
        {
            id: 'amount',
            numeric: false,
            disablePadding: false,
            label: 'Amount (Tzs)',
        },
        {
            id: 'occured_cost',
            numeric: false,
            disablePadding: false,
            label: 'Expense (Tzs)',
        },

    ]

    const url = `cost?project_id=${project_id}&activity_id=${activity_id}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: url,
        modalTitle: 'Cost',
        viewUrl: '',
        state_properties: [],
        isHideShow: true,
        isApiV2: true,
        isMaintainViewNavigationForV1: true
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

export default Cost