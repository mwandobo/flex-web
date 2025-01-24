"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import React, {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import Maintenance from "@/app/workshop/maintenance/maintenance";
import Repair from "@/app/workshop/repair/repair";
import MaintenanceView from "@/app/workshop/maintenance/maintenance-view";
import RepairView from "@/app/workshop/repair/repair-view";

const WorkshopItems = [
    {name: 'maintenance', title: 'Maintenance', item: <Maintenance/>, itemView: <MaintenanceView/>},
    {name: 'repair', title: 'Repair', item: <Repair/>, itemView: <RepairView/>},
];

const checkNotIncluded = (item: string) => {
    return WorkshopItems.find(finance => finance.name === item)
}

function MaintenancePage() {
    const {state, dispatch} = useGlobalContextHook();
    useEffect(() => {
        let selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')

        if(!checkNotIncluded(selectedItem)){
            selectedItem = 'maintenance'
        }
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent
        pageItems={WorkshopItems}
        title="Workshop Management"
        subtitle='Workshop Items'
    />;
}

export default MaintenancePage;