"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {ITEM_APPROVAL_SLUG, REQUEST_FOR_QUOTATION_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
]

const columns = [
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'RFQ Code',
    },
    {
        id: 'payment_method',
        numeric: false,
        disablePadding: false,
        label: 'Payment Method',
    },
    {
        id: 'evaluation_method',
        numeric: false,
        disablePadding: false,
        label: 'Evaluation Method',
    },
    {
        id: 'decision_timeline',
        numeric: false,
        disablePadding: false,
        label: 'Decision Timeline',
    },
    {
        id: 'submission_requirement',
        numeric: false,
        disablePadding: false,
        label: 'Submission Requirement',
    },
    {
        id: 'delivery_time',
        numeric: false,
        disablePadding: false,
        label: 'Deliver Time',
    }
]

function Rfq() {
    const permission = 'rfq'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'rfq',
        modalTitle: 'Rfq',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'rfq',
        approval_slug: REQUEST_FOR_QUOTATION_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Requisition Requests"}
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

export default Rfq