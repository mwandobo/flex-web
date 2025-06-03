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
import PricingView from "@/app/sales/pricing/pricing-view";
import Pricing from "@/app/sales/pricing/pricing";
import SoldItems from "@/app/sales/sold-items/sold-items";
import SoldItemsView from "@/app/sales/sold-items/sold-items-view";

const SalesItems = [
    {name: 'rfq', title: 'Rfq', item: <SalesRfq/>, itemView: <SalesRfqView/>},
    {name: 'customer', title: 'Customers', item: <Customer/>, itemView: <CustomerView/>},
    {name: 'quotation', title: 'Quotations', item: <SalesQuotation/>, itemView: <SalesQuotationView/>},
    {name: 'order', title: 'Orders', item: <Order/>, itemView: <OrderView/>},
    {name: 'pricing', title: 'Pricing', item: <Pricing/>, itemView: <PricingView/>},
    {name: 'Sold Items', title: 'Sold Items', item: <SoldItems/>, itemView: <SoldItemsView/>},
];

function SalesPage() {
    const {state, dispatch} = useGlobalContextHook();
    const checkNotIncluded = (item: string) => {
        return SalesItems.find(finance => finance.name === item)
    }
    useEffect(() => {
        let selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        if(!checkNotIncluded(selectedItem)){
            selectedItem = 'rfq'
        }
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={SalesItems} title="Sales Management"
                                          subtitle='Sales Items'/>;
}

export default SalesPage;
