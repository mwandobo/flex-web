"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import {ITEM_APPROVAL_SLUG, QUOTATION_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = [
    {
        name: 'request_for_quotation_id',
        type: 'select',
        label: 'Request For Quotation',
        value: '',
        optionsUrlData: `/purchase-rfq?status=quotation`,
        optionDataKey: 'rfq',
        control_for: "quotation-item",
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'supplier_id',
        type: 'select',
        label: 'Supplier',
        value: '',
        optionsUrlData: `/suppliers`,
        optionDataKey: 'departments',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'item_ids',
        type: 'multi-select',
        label: 'Quotation Items',
        value: '',
        optionsUrlData: 'rfq/undefined/items-for-select',
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
    {
        name: 'file',
        type: 'file',
        label: 'Attachment',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
]

const columns = [
    {
        id: 'rfq_name',
        numeric: false,
        disablePadding: false,
        label: 'RFQ ',
    },
    {
        id: 'formatted_code',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Code',
    },
    {
        id: 'supplier_name',
        numeric: false,
        disablePadding: false,
        label: 'Supplier',
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

function Quotation() {
    const permission = 'quotation'

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'quotations?type=internal',
        modalTitle: 'Quotation',
        viewUrl: '/procurement/rfq/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'quotation',
        approval_slug: QUOTATION_APPROVAL_SLUG,
        isHideEdit:true,
        isFormData: true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Quotations"}
                                handleClick={handleClick}
                                isShowAddButton={true}
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

export default Quotation