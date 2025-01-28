"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [
    {
        name: 'delivery_quantity',
        type: 'text',
        label: 'Delivery Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Note',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Date',
        width: '10%'
    }
]

interface Props {
    maintenance: any
}

function MaintenanceHistory({maintenance}: Props) {
    const permission = 'maintenance'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `maintenance/${maintenance?.id}/maintenance-notes`,
        modalTitle: 'Maintenance History',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'maintenance-history',
        isHideShow: true,
        isHideDelete: true,
        isHideEdit: true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Maintenance History"}
                                handleClick={handleClick}
                                isShowAddButton={false}

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

export default MaintenanceHistory