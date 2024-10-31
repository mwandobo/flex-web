"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import {usePageData} from '@/hooks/use-page/use-page-data'
import {checkPermissions} from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import {DELIVERABLE_APPROVAL_SLUG} from "@/utils/constant";

const formInputs = []

const columns = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Item Name',
    },
    {
        id: 'project_name',
        numeric: false,
        disablePadding: false,
        label: 'Project Name',
    },
    {
        id: 'activity_name',
        numeric: false,
        disablePadding: false,
        label: 'Activity Name',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    }
]

function ItemDeliverable() {
    const permission = 'deliverable'

    const {
        loading,
        createdForm,
        handleClick,
        tabular

    } = usePageData({
        columns: columns,
        formInputs: formInputs,
        url: 'deliverable',
        modalTitle: 'Deliverable',
        viewUrl: '/inventory/items-categories/',
        state_properties: [],
        permission: permission,
        isApiV2: true,
        from: 'item-deliverable',
        approval_slug: DELIVERABLE_APPROVAL_SLUG
    })

    return (
        <ProtectedRoute>
            <>{
                !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> : <>
                    {loading ? <p>Loading...</p>
                        :
                        <>
                            <PageHeader
                                title={"Deliverables"}
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

export default ItemDeliverable