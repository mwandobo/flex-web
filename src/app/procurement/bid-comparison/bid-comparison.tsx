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
        label: 'Request For Quotation ',
    },
    {
        id: 'formatted_rfq_date',
        numeric: false,
        disablePadding: false,
        label: 'Purchase Request Date',
    },
    {
        id: 'formatted_comparison_date',
        numeric: false,
        disablePadding: false,
        label: 'Bid Comparison Date',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

function BidComparison() {
    const permission = 'bid-comparison-list'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'bid-comparison',
        modalTitle: 'Quotation',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'bid-comparison'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Bid Comparison"}
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

export default BidComparison