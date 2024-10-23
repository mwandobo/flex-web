"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import { SALE_RFQ_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'customer_id',
        type: 'select',
        label: 'Customer',
        value: '',
        optionsUrlData: `/customers?approved=approved&status=quotation`,
        optionDataKey: 'quotation-item',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'item_ids',
        type: 'multi-select',
        label: 'Items',
        value: '',
        optionsUrlData: 'item',
        optionDataKey: 'quotation-item',
        control: "quotation-item",
        required: true,
        isError: false,
    },
    {
        name: 'payment_method',
        type: 'text',
        label: 'Payment Method',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'evaluation_method',
        type: 'text',
        label: 'Evaluation Method',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'decision_timeline',
        type: 'text',
        label: 'Decision Timeline',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'submission_requirement',
        type: 'text',
        label: 'Submission Requirement',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'delivery_time',
        type: 'text',
        label: 'Deliver Time',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'terms_and_conditions',
        type: 'textArea',
        label: 'Terms and Conditions',
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
        label: 'RFQ Code',
    },
    {
        id: 'customer_name',
        numeric: false,
        disablePadding: false,
        label: 'Customer Name',
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
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    }
]

function SalesRfq() {
    const permission = 'sales-rfq'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'rfq?type=external',
        modalTitle: 'Rfq',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'sales-rfq',
        approval_slug: SALE_RFQ_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Request For Quotation"}
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

export default SalesRfq