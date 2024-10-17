"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SettingItem from "@/app/settings/setting-item";

const SettingsItems = [
    { name: 'project-type', title: 'Project Types', item: <SettingItem group={'project'} /> },
];

function SettingPage() {
    const {state, dispatch} = useGlobalContextHook();

    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={SettingsItems} title="Settings Management"  subtitle="Setting Items" />;
}

export default SettingPage;
