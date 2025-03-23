"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {ITEM_APPROVAL_SLUG, PURCHASE_ORDER_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'sale_quotation_id',
        type: 'select',
        label: 'Quotation',
        value: '',
        optionsUrlData: `/sale-quotations?status=submitted`,
        optionDataKey: 'rfq',
        control_for: "rfq",
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
        label: 'Sale Order ',
    },
    {
        id: 'customer_name',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
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

function Order() {
    const permission = 'purchase_order'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `sale-orders`,
        modalTitle: 'Sale Order',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'order',
        isHideDelete: false,
        isHideEdit: true,
        approval_slug: PURCHASE_ORDER_APPROVAL_SLUG
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

export default Order