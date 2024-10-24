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
import Service from "@/app/inventory/services/service";
import ServiceView from "@/app/inventory/services/service-view";
import Warranty from "@/app/inventory/warranty/warranty";
import WarrantyView from "@/app/inventory/warranty/warranty-view";
import Stores from "@/app/inventory/stores/stores";
import StoresView from "@/app/inventory/stores/stores-view";
import Delivery from "@/app/inventory/delivery/delivery";
import DeliveryView from "@/app/inventory/delivery/delivery-view";
import Inspection from "@/app/inventory/inspection/inspection";
import InspectionView from "@/app/inventory/inspection/inspection-view";
import ItemRequest from "@/app/inventory/store-request/item-request/item-request";
import ItemRequestView from "@/app/inventory/store-request/item-request/item-request-view";
import ServiceRequest from "@/app/inventory/store-request/service-request/service-request";
import ServiceRequestView from "@/app/inventory/store-request/service-request/service-request-view";
import PersonnelRequest from "@/app/inventory/personnel-request/personnel-request";
import PersonnelRequestView from "@/app/inventory/personnel-request/personnel-request-view";

const InventoryItems = [
    { name: 'item-categories', title: 'Item Categories', item: <ItemsCategories />, itemView: <ItemsCategoryView /> },
    { name: 'items', title: 'Items', item: <Items />, itemView: <ItemsView /> },
    { name: 'services', title: 'Services', item: <Service />, itemView: <ServiceView /> },
    { name: 'warranties', title: 'Warranties', item: <Warranty />, itemView: <WarrantyView /> },
    { name: 'suppliers', title: 'Suppliers', item: <Suppliers />, itemView: <SuppliersView /> },
    { name: 'stores', title: 'Stores', item: <Stores />, itemView: <StoresView /> },
    { name: 'deliveries', title: 'Deliveries', item: <Delivery />, itemView: <DeliveryView /> },
    { name: 'inspections', title: 'Inspections', item: <Inspection />, itemView: <InspectionView /> },
    { name: 'store-item-request', title: 'Store Item Requests', item: <ItemRequest />, itemView: <ItemRequestView /> },
    { name: 'service-request', title: 'Service Requests', item: <ServiceRequest />, itemView: <ServiceRequestView /> },
    { name: 'personnel-request', title: 'Personnel Requests', item: <PersonnelRequest />, itemView: <PersonnelRequestView /> },
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
