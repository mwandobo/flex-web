"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {tr} from "date-fns/locale";
import RequisitionFormComponent from "@/app/procurement/requisition-requests/components/requisition-form.component";

const formInputs = [
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
        label: 'Requested Quantity',
    },
    {
        id: 'quantity',
        numeric: false,
        disablePadding: false,
        label: 'RFQ Quantity',
    }
]

interface Props {
    rfq_id: string
}

function RfqItems({rfq_id}: Props) {
    const permission = 'rfq_item'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `rfq/${rfq_id}/items`,
        modalTitle: 'Rfq Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'rfq-items',
        itHasCustomForm: true,
        customForm: <RequisitionFormComponent/>,
        isHideShow:true
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"RFQ Items"}
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

export default RfqItems