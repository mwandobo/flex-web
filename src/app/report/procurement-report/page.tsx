"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import RequisitionRequestReport from "@/app/report/procurement-report/items/requisition-request.report";
import RfqReport from "@/app/report/procurement-report/items/rfq.report";
import PurchaseOrderReport from "@/app/report/procurement-report/items/purchase-order.report";
import InternalInvoiceReport from "@/app/report/procurement-report/items/internal-invoice.report";
import ExternalInvoiceReport from "@/app/report/procurement-report/items/external-invoice.report";
import PaymentReport from "@/app/report/procurement-report/items/payment.report";
import OrderReport from "@/app/report/procurement-report/items/order.report";
import ServiceReport from "@/app/report/procurement-report/items/service.report";
import SupplierReport from "@/app/report/procurement-report/items/supplier.report";
import ItemReport from "@/app/report/procurement-report/items/item.report";
import CustomerReport from "@/app/report/procurement-report/items/customer.report";
import StoreReport from "@/app/report/procurement-report/items/store.report";

const ProcurementItems = [
    {
        name: 'requisition-requests',
        title: 'Requisition Requests',
        item: <RequisitionRequestReport/>,
    },
    {
        name: 'rfq',
        title: 'Request For Quotation',
        item: <RfqReport/>,
    },
    {
        name: 'purchase-order',
        title: 'Purchase Order',
        item: <PurchaseOrderReport/>,
    },
    {
        name: 'internal-invoice',
        title: 'Internal Invoice (purchase)',
        item: <InternalInvoiceReport/>,
    },
    {
        name: 'external-invoice',
        title: 'External Invoice (sale)',
        item: <ExternalInvoiceReport/>,
    },
    {
        name: 'payment',
        title: 'Payments',
        item: <PaymentReport/>,
    },
    {
        name: 'order',
        title: 'Orders',
        item: <OrderReport/>,
    },
    {
        name: 'item',
        title: 'Items',
        item: <ItemReport/>,
    },
    {
        name: 'service',
        title: 'Services',
        item: <ServiceReport/>,
    },
    {
        name: 'supplier',
        title: 'Suppliers',
        item: <SupplierReport/>,
    },
    {
        name: 'customer',
        title: 'Customer',
        item: <CustomerReport/>,
    },
    {
        name: 'store',
        title: 'Stores',
        item: <StoreReport/>,
    },
];

function InventoryPage() {
    const { dispatch} = useGlobalContextHook();
    const checkNotIncluded = (item: string) => {
        return ProcurementItems.find(finance => finance.name === item)
    }
    useEffect(() => {
        let selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        if(!checkNotIncluded(selectedItem)){
            selectedItem = 'requisition-requests'
        }
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={ProcurementItems} title="Procurement Management"
                                          subtitle='Procurement Items'/>;
}

export default InventoryPage;
