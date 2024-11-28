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

function Indicator({
    from,
    from_id,
    project_id,
    means_of_verification,
    isHideAdd

}: Props) {


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
            name: 'measurement_type_id',
            type: 'select',
            label: `Means of Verification`,
            value: means_of_verification,
            optionsUrlData: `settings?group=measurement`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: ''
        },
        ['goal', 'outcome'].includes(from) &&
        {
            name: 'baseline_data',
            type: 'text',
            label: 'Baseline Data',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'target_data',
            type: 'text',
            label: 'Target Data',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'collection_method',
            type: 'text',
            label: 'Collection Method',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'frequency',
            type: 'text',
            label: 'Frequency and Schedule',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'responsibilities',
            type: 'text',
            label: 'Responsibilities',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'audience',
            type: 'text',
            label: 'Information Use / Audience',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'description',
            type: 'textArea',
            label: 'Description',
            value: '',
            required: false,
            isError: false,
            errorMessage: ''
        }
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
    ]


    const url = `indicator/${project_id}/${from}/${from_id}`

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
        viewUrl: '',
        state_properties: [],
        isHideShow: true
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

export default Indicator