"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [
    {
        name: 'quantity',
        type: 'text',
        label: 'Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
        width: '20%'
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Price',
    },
    {
        id: 'requisition_quantity',
        numeric: false,
        disablePadding: false,
        label: 'requested Quantity',
    }
]

interface Props {
    requisition_request_id: string
    status: string
}

function RequisitionRequestItem({requisition_request_id, status}: Props) {
    const permission = 'requisition_request_item'

    console.log('status',status)

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `requisition-request/${requisition_request_id}/items`,
        modalTitle: 'Requisition Request Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [status],
        permission: permission,
        isApiV2:true,
        from: 'requisition-requests',
        isHideShow:true,
        isHideDelete:true,
        isHideEdit: status !== 'pending'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Requested Items"}
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

export default RequisitionRequestItem