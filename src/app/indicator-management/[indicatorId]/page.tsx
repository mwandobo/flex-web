"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get} from "@/utils/api";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import MuiTab from "@/components/tabs/mui-tab";
import CollectedData from "@/app/indicator-management/collected-data.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2} from "lucide-react";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {INDICATOR_APPROVAL_SLUG} from "@/utils/constant";

const CollectedDataShow = ({params}: { params: { indicatorId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.indicatorId

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: INDICATOR_APPROVAL_SLUG,
        from: INDICATOR_APPROVAL_SLUG,
        from_id: id
    })

    const url = `indicator/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const nodes: React.ReactNode[] = [
        <CollectedData
            key={'collected_data'}
            indicator_id={id}
        />,
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
                }
            }
        };
        fetchData()
    }, [refresh])

    const onSave = async () => {
        try {
            const res = await get(`${url}/${data?.status === 'pending'?'disable': 'enable'}`, token);
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To ${data?.status === 'pending'?'Disable': 'Enable'}  Indicator: ${data.formatted_code}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
                <ReusableButton
                    name={data?.status ==='pending'?'Disable Indicator': 'Enable Indicator'}
                    onClick={() => handleSubmit()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <CheckCircle2 size={13}/>
                </ReusableButton>
        </>
    }

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                {name: 'Indicator', linkTo: '/indicator', permission: 'data', isClickable: true},
                                {name: 'Show', linkTo: '', permission: ''},]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    {label: 'Indicator Code', value: data?.formatted_code},
                                    {label: 'Indicator Name', value: data?.name},
                                    {label: 'Project Name', value: data?.project_name},
                                    {label: 'From', value: data?.formatted_from},
                                    {label: 'Means of verification', value: data?.mov},
                                    {label: 'Baseline Data', value: data?.baseline_data},
                                    {label: 'Target Data', value: data?.target_data},
                                    {label: 'Collected Data', value: data?.collected_data},
                                    {label: 'Audience', value: data?.audience},
                                    {label: 'Collection Method', value: data?.collection_method},
                                    {label: 'Frequency and Schedule', value: data?.frequency},
                                    {label: 'Responsibilities', value: data?.responsibilities},
                                    {label: 'Description', value: data?.description},
                                    { label: 'Status', value:data?.status },
                                ]}
                                titleA="Indicator"
                                titleB={`${data?.formatted_code} : ${data?.name}`}
                                OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                            />

                        </MuiCardComponent>
                        <MuiCardComponent>
                            <MuiTab
                                columns={["Collected Data"]}
                                nodes={nodes}
                            />
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default CollectedDataShow;