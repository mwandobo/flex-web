"use client"

import InternalMenuSkeletonComponent from "@/components/page-components/internal-menu-skeleton-component";
import {useEffect} from "react";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import ConfigurationItem from "@/app/configurations/configuration-item";

const ConfigurationItems = [
    { name: 'resource-type', title: 'Resource Types', item: <ConfigurationItem group={'resource'} /> },
    { name: 'stakeholder-type', title: 'Stakeholder Types', item: <ConfigurationItem group={'stakeholder'} /> },
    { name: 'sponsor-type', title: 'Sponsor Types', item: <ConfigurationItem group={'sponsor'} /> },
    { name: 'representative-type', title: 'Representative Types', item: <ConfigurationItem group={'representative'} /> },
    { name: 'sponsorship-type', title: 'Sponsorship Types', item: <ConfigurationItem group={'sponsorship'} /> },
    { name: 'measurement-type', title: 'Indicator Measurements Types', item: <ConfigurationItem group={'measurement'} /> },
    { name: 'assignment-type', title: 'Resource Types', item: <ConfigurationItem group={'assignment'} /> },
];

function ConfigurationPage() {
    const {state, dispatch} = useGlobalContextHook();

    useEffect(() => {
        const selectedItem = getValueFromLocalStorage('selected_sub_sidebar_item')
        const sideViewPayload = JSON.parse(getValueFromLocalStorage('sub_view_item'))
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: selectedItem});
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: sideViewPayload})
    }, []);

    return <InternalMenuSkeletonComponent pageItems={ConfigurationItems} title="Configuration Management"  subtitle="Configuration Items" />;
}

export default ConfigurationPage;
