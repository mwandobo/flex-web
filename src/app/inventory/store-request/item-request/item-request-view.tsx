"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get} from "@/utils/api";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import { ITEMS_REQUESTS_APPROVAL_SLUG,} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import { FileOutput} from "lucide-react";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const ItemRequestView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)

    const {state} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `store-requests/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: ITEMS_REQUESTS_APPROVAL_SLUG,
        from: ITEMS_REQUESTS_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async (url) => {
        try {
            const res = await get(url, token);
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
            text: `Are You Sure You Want To Submit Item Store Request: ${data.resource_name}?`,
            onConfirm: () => onSave(`${url}/submit-draft`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleItemDispatch = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Dispatch Item ${data.resource_name} for this Store Request?`,
            onConfirm: () => onSave(`${url}/dispatch`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleCompleteDispatch = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Complete Dispatch for Item ${data.resource_name}?`,
            onConfirm: () => onSave(`${url}/complete-dispatch`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };


    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit Item Request'}
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
                    <FileOutput size={13}/>
                </ReusableButton>
            }
            {data?.status === 'submitted' &&
                <ReusableButton
                    name={'Dispatch Item'}
                    onClick={() => handleItemDispatch()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
                </ReusableButton>
            }
            {data?.status === 'partial_dispatched' &&
                <ReusableButton
                    name={'Complete Dispatch'}
                    onClick={() => handleCompleteDispatch()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
                </ReusableButton>
            }
        </>
    }


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

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Item Store Request View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Item Name', value: data?.resource_name},
                                        {label: 'Requested Quantity', value: data?.quantity},
                                        {label: 'Total Amount', value: data?.amount},
                                        {label: 'Dispatched Quantity', value: data?.dispatched_quantity},
                                        {label: 'Requester Name', value: data?.requester_name},
                                        {label: 'Requested Date', value: data?.formatted_requested_date},
                                        {label: 'Submitted Date', value: data?.formatted_submitted_date},
                                        {label: 'Dispatched Date', value: data?.formatted_dispatched_date},
                                        {label: 'Warranty Status', value: data?.warranty_status},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Item Store Request`}
                                    titleB={` ${data?.resource_name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ItemRequestView;