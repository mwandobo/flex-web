"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import InvoiceView from "@/app/finance/invoice/invoice-view";
import Invoice from "@/app/finance/invoice/invoice";
import Payment from "@/app/finance/payment/payment";
import PaymentView from "@/app/finance/payment/payment-view";
import CostCenter from "@/app/finance/cost-center/cost-center";
import CostCenterView from "@/app/finance/cost-center/cost-center-view";
import FinanceRequest from "@/app/finance/finance-request/finance-request";
import FinanceRequestView from "@/app/finance/finance-request/finance-request-view";

const FinanceItems = [
    {name: 'invoice', title: 'Invoices', item: <Invoice/>, itemView: <InvoiceView/>},
    {name: 'payment', title: 'Payments', item: <Payment/>, itemView: <PaymentView/>},
    {name: 'cost-center', title: 'Cost Centers', item: <CostCenter/>, itemView: <CostCenterView/>},
    {name: 'finance-request', title: 'Finance Requests', item: <FinanceRequest/>, itemView: <FinanceRequestView/>},
];

function FinancePage() {
    const {state, dispatch} = useGlobalContextHook();
    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent
        pageItems={FinanceItems}
        title="Finance Management"
        subtitle='Finance Items'
    />;
}

export default FinancePage;