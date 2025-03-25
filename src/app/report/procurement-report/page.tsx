"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import RequisitionRequestReport from "@/app/report/procurement-report/items/requisition-request.report";
import PurchaseOrderReport from "@/app/report/procurement-report/items/purchase-order.report";
import PurchaseInvoiceReport from "@/app/report/procurement-report/items/purchase-invoice.report";
import SaleInvoiceReport from "@/app/report/procurement-report/items/sale-invoice.report";
import PaymentReport from "@/app/report/procurement-report/items/payment.report";
import SaleOrderReport from "@/app/report/procurement-report/items/sale-order.report";
import ServiceReport from "@/app/report/procurement-report/items/service.report";
import SupplierReport from "@/app/report/procurement-report/items/supplier.report";
import ItemReport from "@/app/report/procurement-report/items/item.report";
import CustomerReport from "@/app/report/procurement-report/items/customer.report";
import StoreReport from "@/app/report/procurement-report/items/store.report";
import DeliverableReport from "@/app/report/procurement-report/items/deliverable.report";
import DeliveryReport from "@/app/report/procurement-report/items/deliveries.report";
import InspectionReport from "@/app/report/procurement-report/items/inspection.report";
import ResourceRequestReport from "@/app/report/procurement-report/items/resource-request.report";
import FundRequestReport from "@/app/report/procurement-report/items/fund-request.report";
import EquipmentReport from "@/app/report/procurement-report/items/equipment.report";
import PurchaseRfqReport from "@/app/report/procurement-report/items/purchase-rfq.report";
import SaleRfqReport from "@/app/report/procurement-report/items/sale-rfq.report";
import PurchaseQuotationReport from "@/app/report/procurement-report/items/purchase-quotation.report";

const ProcurementItems = [
    {
        name: 'requisition-requests',
        title: 'Requisition Requests',
        item: <RequisitionRequestReport/>,
    },
    {
        name: 'purchase-rfq',
        title: 'Purchase Request For Quotation',
        item: <PurchaseRfqReport/>,
    },
    {
        name: 'purchase-quotation',
        title: 'Purchase Quotation',
        item: <PurchaseQuotationReport/>,
    },
    {
        name: 'purchase-order',
        title: 'Purchase Order',
        item: <PurchaseOrderReport/>,
    },
    {
        name: 'external-invoice',
        title: 'Purchase Invoice (External)',
        item: <PurchaseInvoiceReport/>,
    },
    {
        name: 'sale-rfq',
        title: 'Sale Request For Quotation',
        item: <SaleRfqReport/>,
    },
    {
        name: 'sale-order',
        title: 'Sale Order',
        item: <SaleOrderReport/>,
    },
    {
        name: 'internal-invoice',
        title: 'Sale Invoice (internal)',
        item: <SaleInvoiceReport/>,
    },
    {
        name: 'payment',
        title: 'Payments',
        item: <PaymentReport/>,
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
    {
        name: 'deliverable',
        title: 'Deliverables',
        item: <DeliverableReport/>,
    },
    {
        name: 'deliveries',
        title: 'Delivery',
        item: <DeliveryReport/>,
    },
    {
        name: 'inspection',
        title: 'Inspection',
        item: <InspectionReport/>,
    },
    {
        name: 'resource-request',
        title: 'Resource Requests',
        item: <ResourceRequestReport/>,
    },
    {
        name: 'fund-request',
        title: 'Fund Request',
        item: <FundRequestReport/>,
    },   {
        name: 'equipment',
        title: 'Equipment',
        item: <EquipmentReport/>,
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

    return <InternalMenuSkeletonComponent pageItems={ProcurementItems} title="All Procurement Reports"
                                          subtitle='Reports'/>;
}

export default InventoryPage;
