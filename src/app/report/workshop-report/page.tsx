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
import MaintenanceReport from "@/app/report/workshop-report/items/maintenance.report";
import RepairReport from "@/app/report/workshop-report/items/repair.report";
import WorkshopServiceRequestReport from "@/app/report/workshop-report/items/workshop-service-request.report";

const WorkshopItems = [
    {
        name: 'maintenance',
        title: 'Maintenance',
        item: <MaintenanceReport/>,
    },
    {
        name: 'repair',
        title: 'Repair',
        item: <RepairReport/>,
    },
    {
        name: 'workshop-service-request',
        title: 'Workshop Service Request',
        item: <WorkshopServiceRequestReport/>,
    },
];

function WorkshopPage() {
    const { dispatch} = useGlobalContextHook();
    const checkNotIncluded = (item: string) => {
        return WorkshopItems.find(finance => finance.name === item)
    }
    useEffect(() => {
        let selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        if(!checkNotIncluded(selectedItem)){
            selectedItem = 'maintenance'
        }
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={WorkshopItems} title="All Workshop Reports"
                                          subtitle='Reports'/>;
}

export default WorkshopPage;
