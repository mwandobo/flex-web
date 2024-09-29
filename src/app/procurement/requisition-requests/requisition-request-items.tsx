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
        label: 'requested Quantity',
    }
]

interface Props {
    requisition_request_id: string
}

function RequisitionRequestItem({requisition_request_id}: Props) {
    const permission = 'requisition-request-item-list'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `requisition-request/${requisition_request_id}/items`,
        modalTitle: 'Requisition Request Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'requisition-requests',
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
                                title={"Requested Items"}
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

export default RequisitionRequestItem