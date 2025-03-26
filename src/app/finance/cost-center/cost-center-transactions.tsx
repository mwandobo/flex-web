"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [

]

const columns = [
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Code',
    },
    {
        id: 'transaction_type',
        numeric: false,
        disablePadding: false,
        label: 'Transaction Type',
    },
    {
        id: 'sale_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Sale Order',
    },
    {
        id: 'purchase_order_name',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Order',
    },
    {
        id: 'user_name',
        numeric: false,
        disablePadding: false,
        label: 'User',
    },
    {
        id: 'amount',
        numeric: false,
        disablePadding: false,
        label: 'Amount',
    }
]

interface Props {
    cost_center: any
}

function CostCenterTransactions({cost_center}: Props) {
    const permission = 'maintenance'


    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `cost-centers/${cost_center?.id}/transactions`,
        modalTitle: 'Transactions ',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'maintenance-history',
        isHideActions:true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Transactions"}
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

export default CostCenterTransactions