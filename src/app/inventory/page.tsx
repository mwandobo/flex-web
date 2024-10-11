"use client"

import ItemsCategories from "@/app/inventory/items-categories/items-categories";
import ItemsCategoryView from "@/app/inventory/items-categories/items-category-view";
import Items from "@/app/inventory/items/items";
import ItemsView from "@/app/inventory/items/items-view";
import Suppliers from "@/app/inventory/suppliers/suppliers";
import SuppliersView from "@/app/inventory/suppliers/suppliers-view";
import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

const InventoryItems = [
    { name: 'item-categories', title: 'Item Categories', item: <ItemsCategories />, itemView: <ItemsCategoryView /> },
    { name: 'items', title: 'Items', item: <Items />, itemView: <ItemsView /> },
    { name: 'suppliers', title: 'Suppliers', item: <Suppliers />, itemView: <SuppliersView /> },
];

function InventoryPage() {
    const {state, dispatch} = useGlobalContextHook();

    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={InventoryItems} title="Inventory Management"  subtitle="Inventory Items" />;
}

export default InventoryPage;
