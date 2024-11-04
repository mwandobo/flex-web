"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import RequisitionRequest from "@/app/procurement/requisition-requests/requisition-request";
import RequisitionRequestView from "@/app/procurement/requisition-requests/requisition-request-view";
import Rfq from "@/app/procurement/rfq/rfq";
import RfqView from "@/app/procurement/rfq/rfq-view";
import Quotation from "@/app/procurement/quotation/quotation";
import QuotationView from "@/app/procurement/quotation/quotation-view";
import BidComparison from "@/app/procurement/bid-comparison/bid-comparison";
import BidComparisonView from "@/app/procurement/bid-comparison/bid-comparison-view";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PurchaseOrder from "@/app/procurement/purchase-order/purchase-order";
import PurchaseOrderView from "@/app/procurement/purchase-order/purchase-order-view";
import Invoice from "@/app/finance/invoice/invoice";
import InvoiceView from "@/app/finance/invoice/invoice-view";
import Payment from "@/app/finance/payment/payment";
import PaymentView from "@/app/finance/payment/payment-view";
import CostCenter from "@/app/finance/cost-center/cost-center";
import CostCenterView from "@/app/finance/cost-center/cost-center-view";
import FinanceRequest from "@/app/finance/finance-requests/finance-request";
import FinanceRequestView from "@/app/finance/finance-requests/finance-request-view";

const ProcurementItems = [
    {
        name: 'requisition-requests',
        title: 'Requisition Requests',
        item: <RequisitionRequest/>,
        itemView: <RequisitionRequestView/>
    },
    {name: 'request-for-quotation', title: 'Requests For Quotations', item: <Rfq/>, itemView: <RfqView/>},
    {name: 'quotation', title: 'Quotations', item: <Quotation/>, itemView: <QuotationView/>},
    {name: 'bid-comparison', title: 'Bid Comparison', item: <BidComparison/>, itemView: <BidComparisonView/>},
    {name: 'purchase-order', title: 'Purchase Orders', item: <PurchaseOrder/>, itemView: <PurchaseOrderView/>},
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
