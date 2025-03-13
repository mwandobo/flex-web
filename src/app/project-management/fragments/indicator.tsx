"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import React from 'react'
import IndicatorView from "@/app/project-management/fragments/indicator-view";


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
            name: 'collected_date',
            type: 'text',
            label: 'Collected Data',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
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


    const url = `indicator?project_id=${project_id}&from=${from}&from_id=${from_id}&measurement_type_id=${means_of_verification}`

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
        isHideShow: false,
        isApiV2: true,
        isMaintainViewNavigationForV1: true,
        isHideDelete:isHideAdd,
        isHideEdit: isHideAdd,
        sliderComponent: IndicatorView
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