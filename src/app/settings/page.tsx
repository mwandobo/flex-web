"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SettingItem from "@/app/settings/setting-item";

const SettingItems = [
    { name: 'resource-type', title: 'Resource Types', item: <SettingItem group={'resource'} /> },
    { name: 'stakeholder-type', title: 'Stakeholder Types', item: <SettingItem group={'stakeholder'} /> },
    { name: 'sponsor-type', title: 'Sponsor Types', item: <SettingItem group={'sponsor'} /> },
    { name: 'representative-type', title: 'Representative Types', item: <SettingItem group={'representative'} /> },
    { name: 'sponsorship-type', title: 'Sponsorship Types', item: <SettingItem group={'sponsorship'} /> },
    { name: 'measurement-type', title: 'Indicator Measurements Types', item: <SettingItem group={'measurement'} /> },
    { name: 'assignment-type', title: 'Resource Types', item: <SettingItem group={'assignment'} /> },
    { name: 'project-type', title: 'Project Types', item: <SettingItem group={'project'} /> },
];

function ConfigurationPage() {
    const {state, dispatch} = useGlobalContextHook();

    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={SettingItems} title="Settings Management"  subtitle="Setting Items" />;
}

export default ConfigurationPage;
