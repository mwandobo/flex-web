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
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2,} from "lucide-react";
import PurchaseOrderItems from "@/app/procurement/purchase-order/purchase-order-items";
import moneyFormater from "@/components/moneyFormater";
import { PURCHASE_ORDER_APPROVAL_SLUG} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
const PurchaseOrderView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `purchase-orders/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: PURCHASE_ORDER_APPROVAL_SLUG,
        from: PURCHASE_ORDER_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async () => {
        try {
            const res = await get(`${url}/submit-draft`, token);

            console.log('await get(`${url}/submit-draft`, token);', res)
            if (res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Purchase Order Code: ${data.formatted_code}?`,
            onConfirm: onSave,  // Action to perform on confirmation
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
                        name={'Submit Purchase Order'}
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
        </>
    }

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                           title={'Purchase Order View'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Purchase Order Code', value: data?.formatted_code},
                                        {label: 'Supplier', value: data?.supplier_name},
                                        {label: 'Quotation Code', value: data?.quotation_name},
                                        {label: 'RFQ Code', value: data?.rfq_name},
                                        {label: 'Total Amount', value: moneyFormater({amount: data?.total_amount})},
                                        {label: 'Payment Method', value: data?.quotation?.payment_method},
                                        {label: 'Evaluation Method', value: data?.quotation?.evaluation_method},
                                        {label: 'Decision Timeline', value: data?.quotation?.decision_timeline},
                                        {
                                            label: 'Submission Requirement',
                                            value: data?.quotation?.submission_requirement
                                        },
                                        {label: 'Delivery Time', value: data?.quotation?.delivery_time},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Terms and Conditions', value: data?.quotation?.terms_and_conditions},

                                    ]}
                                    titleA={`Purchase Request`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <PurchaseOrderItems purchase_order_id={id}/>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default PurchaseOrderView;