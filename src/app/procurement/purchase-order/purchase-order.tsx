"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";

const formInputs = [

]

const columns = [
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order ',
    },
    {
        id: 'supplier_name',
        numeric: false,
        disablePadding: false,
        label: 'Supplier Name',
    },
    {
        id: 'quotation_name',
        numeric: false,
        disablePadding: false,
        label: 'Quotation',
    },
    {
        id: 'rfq_name',
        numeric: false,
        disablePadding: false,
        label: 'RFQ',
    },
    {
        id: 'total_amount',
        numeric: false,
        disablePadding: false,
        label: 'Amount',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function PurchaseOrder() {
    const permission = 'purchase-order-list'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'purchase-orders',
        modalTitle: 'Purchase Order',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'bid-comparison',
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
                                title={"Purchase Order"}
                                handleClick={handleClick}
                                isShowAddButton={true}
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

export default PurchaseOrder