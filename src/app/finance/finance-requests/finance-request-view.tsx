"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import { FINANCE_APPROVAL_SLUG,} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2, FileOutput} from "lucide-react";
import moneyFormater from "@/components/moneyFormater";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const FinanceRequestView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `finance-requests/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: FINANCE_APPROVAL_SLUG,
        from: FINANCE_APPROVAL_SLUG,
        from_id: id,
        parent: 'finance-request'
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
            text: `Are You Sure You Want To Submit Finance Request: ${data.name}?`,
            onConfirm: () => onSave(`${url}/submit-draft`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleItemDispatch = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Dispatch Finance Request ${data.name} ?`,
            onConfirm: () => onSave(`${url}/dispatch`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleCompleteDispatch = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Complete Dispatch for Item ${data.name}?`,
            onConfirm: () => onSave(`${url}/complete-dispatch`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

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


    const buttonsBody = () => {
        return <>


                {data?.status === 'pending' &&
                    <ReusableButton
                        name={'Submit Fund Request'}
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
                }
                {data?.status === 'submitted' &&

                    <ReusableButton
                        name={'Dispatch Fund'}
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
                        name={'Complete Fund Dispatch'}
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


    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Service Store Request View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Fund', value: data?.name},
                                        {label: 'Requested Amount', value: moneyFormater({amount: data?.amount})},
                                        {
                                            label: 'Dispatched Amount',
                                            value: moneyFormater({amount: data?.dispatched_amount})
                                        },
                                        {label: 'Requester Name', value: data?.requester_name},
                                        {label: 'Requested Date', value: data?.formatted_requested_date},
                                        {label: 'Submitted Date', value: data?.formatted_submitted_date},
                                        {label: 'Dispatched Date', value: data?.formatted_dispatched_date},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Service Store Request`}
                                    titleB={` ${data?.resource_name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default FinanceRequestView;