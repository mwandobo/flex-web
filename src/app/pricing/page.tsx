"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import Customer from "@/app/sales/customer/customer";
import CustomerView from "@/app/sales/customer/customer-view";
import Order from "@/app/sales/order/order";
import OrderView from "@/app/sales/order/order-view";
import SalesQuotation from "@/app/sales/sales-quotation/sales-quotation";
import SalesQuotationView from "@/app/sales/sales-quotation/sales-quotation-view";
import SalesRfq from "@/app/sales/sales-rfq/sales-rfq";
import SalesRfqView from "@/app/sales/sales-rfq/sales-rfq-view";

const SalesItems = [
    {name: 'rfq', title: 'Rfq', item: <SalesRfq/>, itemView: <SalesRfqView/>},
    {name: 'customer', title: 'Customers', item: <Customer/>, itemView: <CustomerView/>},
    {name: 'quotation', title: 'Quotations', item: <SalesQuotation/>, itemView: <SalesQuotationView/>},
    {name: 'Orders', title: 'Orders', item: <Order/>, itemView: <OrderView/>},
];

function SalesPage() {
    const {state, dispatch} = useGlobalContextHook();
    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={SalesItems} title="Sales Management"
                                          subtitle='Sales Items'/>;
}

export default SalesPage;
