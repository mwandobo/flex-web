"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import PageHeader from '@/components/header/page-header'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations'
import React, { useEffect, useState } from 'react'

interface Props {
    groupProp?: string;
    project_id?: string | null;
    project?: any;
    isHideAdd?: boolean
    isHideShow?: boolean

}

function ExternalUsers({
    groupProp,
    project_id,
    isHideAdd,
    isHideShow,
    project

}: Props) {
    const hide = () => {
        let hide = false
        if (groupProp && groupProp === 'stakeholder') {
            hide = true;
        }

        if (!groupProp && groupProp !== 'undefined') {
            hide = true;
        }

        return hide
    }

    const groupRoute = getValueFromLocalStorage('group')
    const group = groupProp ?? groupRoute
    const permission = `${group}s`

    const _deptFormInputs = [
        {
            name: 'type_id',
            type: 'select',
            label: `${group} type`,
            value: '',
            optionsUrlData: `settings?group=${group}`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control_for: 'sponsors'
        },

        {
            name: 'external_user_id',
            type: 'select',
            label: `Select ${group} `,
            value: '',
            optionsUrlData: `/undefined/external_users/${group}`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: !groupProp && true,
            control: 'sponsor_type',
            control_id: ''
        },
        {
            name: 'sponsorship_type_id',
            type: 'select',
            label: `Sponsorship type`,
            value: '',
            optionsUrlData: `settings?group=sponsorship`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: hide(),
            control_for: 'sponsorship'

        },
        {
            name: 'name',
            type: 'text',
            label: `Name`,
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            control: 'sponsorship_type',
            control_id: '',
            isRemoved: typeof (groupProp) === 'undefined' && false,
        },

        {
            name: 'amount',
            type: 'text',
            textType: 'number',
            label: 'Amount',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            control: 'sponsorship_type',
            control_id: '',
            isRemoved: true,

        },

        {
            name: 'currency_id',
            type: 'select',
            label: `Currency`,
            value: '',
            optionsUrlData: `currency`,
            optionDataKey: 'departments',
            required: true,
            isError: false,
            errorMessage: '',
            control: 'sponsorship_type',
            control_id: '',
            isRemoved: true,
        },

        {
            name: 'position',
            type: 'text',
            label: 'Position',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: !groupProp && true
        },

        {
            name: 'email',
            type: 'text',
            label: 'Email',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: groupProp && true

        },
        {
            name: 'phone',
            type: 'text',
            label: 'Phone',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: groupProp && true
        },
        {
            name: 'start_date',
            type: 'date',
            label: 'Start Date',
            value: '',
            required: true,
            isError: false,
            minDate: groupProp && project?.start_date,
            maxDate: groupProp && project?.end_date,
            errorMessage: ''
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'End Date',
            value: '',
            required: true,
            isError: false,
            minDate: groupProp && project?.start_date,
            maxDate: groupProp && project?.end_date,
            errorMessage: ''
        },
        {
            name: 'description',
            type: 'textArea',
            label: 'Description',
            value: '',
            required: true,
            isError: false,
            errorMessage: '',
            isRemoved: !groupProp && true
        },
    ]
    const _columns = [
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: `${capitalizeFirstWord(group)} Name`,
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Phone',
        },
        {
            id: 'formatted_start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'formatted_end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        },
    ]

    const ColumnsA = [
        {
            id: 'type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: `${capitalizeFirstWord(group)} Name`,
        },
        {
            id: 'position',
            numeric: false,
            disablePadding: false,
            label: 'Position',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },

        {
            id: 'phone',
            numeric: false,
            disablePadding: false,
            label: 'Phone',
        },
        {
            id: 'sponsorship',
            numeric: false,
            disablePadding: false,
            label: 'Sponsorship',
            isHidden: hide()
        },
        {
            id: 'formatted_start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'formatted_end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        }
    ]

    const url = groupProp ? `project/${project_id}/external_users/${groupProp}` : `undefined/external_users/${groupRoute}`

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: groupProp ? ColumnsA : _columns,
        formInputs: _deptFormInputs,
        url: url,
        modalTitle: `${capitalizeFirstWord(group)}s`,
        viewUrl: `/admnistration/external/`,
        state_properties: [group],
        permission: permission,
        isHideShow: isHideShow,
        isHideDelete:isHideAdd,
        isHideEdit: isHideAdd
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
                                    subHeader={groupProp && `${capitalizeFirstWord(group)}s / List`}
                                    links={[{ name: `${capitalizeFirstWord(group)}s / List`, linkTo: `/admnistration/external/${group}`, permission: '' }]}
                                    isHideAdd={isHideAdd}
                                />
                                {tabular()}
                                {createdForm('md')}
                            </>
                    }
                </>
            }
            </>


        </ProtectedRoute>
    )
}

export default ExternalUsers; // Ensure ExternalUsers is the default export
