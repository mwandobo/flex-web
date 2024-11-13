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
        id: 'user_name',
        numeric: false,
        disablePadding: false,
        label: 'Assigned To',
    },
    {
        id: 'formatted_checked_out_date',
        numeric: false,
        disablePadding: false,
        label: 'Assigned Date',
    },
    {
        id: 'formatted_return_date',
        numeric: false,
        disablePadding: false,
        label: 'Return Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    }
]

interface Props {
    equipment: any
}

function EquipmentItems({equipment}: Props) {
    const permission = 'equipment'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `equipment/${equipment?.id}/history`,
        modalTitle: 'Equipment History',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'equipment-history',
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
                                title={"Equipment History"}
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

export default EquipmentItems