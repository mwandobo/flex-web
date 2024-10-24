"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import {checkPermissions} from '@/utils/actions/check-permissions'
import React from 'react'
import PageHeader from "@/components/header/page-header-v1";
import MuiTab from "@/components/tabs/mui-tab";
import ItemRequest from "@/app/store/store-request/item-request/item-request";
import ServiceRequest from "@/app/store/store-request/service-request/service-request";
import MuiCardComponent from "@/components/card/mui-card.component";

function StoreRequest() {
    const permission = 'store-requests'

    const nodes: React.ReactNode[] = [
        <ItemRequest key={'item'}/>,
        <ServiceRequest key={'service'}/>,
    ];

    return (
        <ProtectedRoute>
            <>
                {
                    !checkPermissions(`${permission}-list`) ? <p>You are not authorized</p> :
                        <>
                            <PageHeader
                                title={"Store Requests"}
                                isShowAddButton={false}
                            />
                            <MuiCardComponent>
                                <MuiTab
                                    columns={[
                                        "Item Request",
                                        "Finance Requests",
                                    ]}
                                    nodes={nodes}
                                >
                                </MuiTab>
                            </MuiCardComponent>
                        </>
                }
            </>
        </ProtectedRoute>
    )
}

export default StoreRequest