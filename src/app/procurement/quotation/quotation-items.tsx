"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React, {useEffect} from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {get} from "@/utils/api";

const formInputs = [
    {
        name: 'price',
        type: 'text',
        label: 'Item Price',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
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
        label: 'Item Price',
    },
    {
        id: 'quotation_price',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Price',
    },

    {
        id: 'rfq_quantity',
        numeric: false,
        disablePadding: false,
        label: 'RFQ Quantity',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Quantity',
    }
]

interface Props {
    quotation: any
}

function QuotationItems({quotation}: Props) {
    const permission = 'quotation_item'

    const {
        loading,
        createdForm,
        handleClick,
        tabular,
        isStateChanged
    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `quotations/${quotation?.id}/items`,
        modalTitle: 'Quotation Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'quotation-items',
        isHideShow:true,
        isShowAddPriceButton:true,
        addPriceFormInputData: formInputs,
        isHideDelete: quotation?.status !== 'pending',
        isHideEdit: quotation?.status !== 'pending'
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Quotation Items"}
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

export default QuotationItems