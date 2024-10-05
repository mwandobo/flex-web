"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import RequisitionFormComponent from "@/app/procurement/requisition-requests/components/requisition-form.component";

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
    quotation_id: string
}

function QuotationItems({quotation_id}: Props) {
    const permission = 'rfq-item-list'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `quotations/${quotation_id}/items`,
        modalTitle: 'Quotation Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'quotation-items',
        itHasCustomForm: true,
        customForm: <RequisitionFormComponent/>,
        isHideShow:true,
        isShowAddPriceButton:true,
        addPriceFormInputData: formInputs,
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