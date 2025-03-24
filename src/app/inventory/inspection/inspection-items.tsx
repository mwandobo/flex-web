"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { usePageData } from '@/hooks/use-page/use-page-data'
import { checkPermissions } from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";

const formInputs = [
    {
        name: 'inspected_quantity',
        type: 'text',
        label: 'Inspected Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'pass_quantity',
        type: 'text',
        label: 'Passed Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'fail_quantity',
        type: 'text',
        label: 'Failed Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'repair_quantity',
        type: 'text',
        label: 'Repaired Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },
    {
        name: 'return_quantity',
        type: 'text',
        label: 'Returned Quantity',
        value: '',
        required: true,
        isError: false,
        errorMessage: ''
    },

]

const columns = [
    {
        id: 'item_name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
        width: '20%'
    },
    {
        id: 'price',
        numeric: false,
        disablePadding: false,
        label: 'Quotation Price',
    },
    {
        id: 'quotation_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Purchased Quantity',
    },
    {
    id: 'delivered_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Delivered Quantity',
    },
    {
        id: 'inspected_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Inspected Quantity',
    },
    {
        id: 'pass_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Perfect Quantity',
    },
    {
        id: 'fail_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Defected Quantity',
    },
    {
        id: 'repair_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Repair Quantity',
    }  ,
    {
        id: 'return_quantity',
        numeric: false,
        disablePadding: false,
        label: 'Return Quantity',
    }
]

interface Props {
    inspection: any
}

function InspectionItems({inspection}: Props) {
    const permission = 'inspection_item'

    console.log('inspection', inspection)

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: `inspections/${inspection.id}/bids`,
        modalTitle: 'Inspection Item',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2:true,
        from: 'inspection-items',
        isHideShow: true,
        isHideDelete: true,
        isHideEdit: inspection.status !== "pending",
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Inspection Items"}
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

export default InspectionItems