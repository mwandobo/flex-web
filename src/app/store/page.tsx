"use client"
import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import StoresView from "@/app/store/stores/stores-view";
import Stores from "@/app/store/stores/stores";
import {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import DeliveryView from "@/app/store/delivery/delivery-view";
import Delivery from "@/app/store/delivery/delivery";
import Inspection from "@/app/store/inspection/inspection";
import InspectionView from "@/app/store/inspection/inspection-view";
import ServiceRequestView from "@/app/store/store-request/service-request/service-request-view";
import ItemRequest from "@/app/store/store-request/item-request/item-request";
import ItemRequestView from "@/app/store/store-request/item-request/item-request-view";
import ServiceRequest from "@/app/store/store-request/service-request/service-request";
import PersonnelRequest from "@/app/store/personnel-request/personnel-request";
import PersonnelRequestView from "@/app/store/personnel-request/personnel-request-view";

const StoreManagementItems = [
    { name: 'stores', title: 'Stores', item: <Stores />, itemView: <StoresView /> },
    { name: 'deliveries', title: 'Deliveries', item: <Delivery />, itemView: <DeliveryView /> },
    { name: 'inspections', title: 'Inspections', item: <Inspection />, itemView: <InspectionView /> },
    { name: 'store-item-request', title: 'Store Item Requests', item: <ItemRequest />, itemView: <ItemRequestView /> },
    { name: 'service-request', title: 'Service Requests', item: <ServiceRequest />, itemView: <ServiceRequestView /> },
    { name: 'personnel-request', title: 'Personnel Requests', item: <PersonnelRequest />, itemView: <PersonnelRequestView /> },
];

function StoreManagementPage() {
    const {state, dispatch} = useGlobalContextHook();
    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);
    return <InternalMenuSkeletonComponent pageItems={StoreManagementItems} title="Store Management"  subtitle="Store Items" />;
}

export default StoreManagementPage;