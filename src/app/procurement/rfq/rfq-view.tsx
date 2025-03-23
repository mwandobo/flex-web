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
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2} from "lucide-react";
import RfqItems from "@/app/procurement/rfq/rfq-items";
import { REQUEST_FOR_QUOTATION_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {showConfirmationModal} from "@/utils/showAlertDialog";

const RfqView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `purchase-rfq/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: REQUEST_FOR_QUOTATION_APPROVAL_SLUG,
        from: REQUEST_FOR_QUOTATION_APPROVAL_SLUG,
        from_id: id
    })

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit RFQ with code: ${data.formatted_code}?`,
            onConfirm: () => onSave(),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };


    const onSave = async () => {
        try {
            const res = await get(`${url}/submit-draft`, token)
            if (data && res.status === 200) {
                setRefresh(!refresh)
            }

        } catch (error: any) {
            console.log(Error)
        }
    }

    const buttonsBody = () => {
        return <>

            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit RFQ'}
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
                            title={'RFQ View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Request for Quotation Code', value: data?.formatted_code},
                                        {label: 'Payment Method', value: data?.payment_method},
                                        {label: 'Evaluation Method', value: data?.evaluation_method},
                                        {label: 'Decision Timeline', value: data?.decision_timeline},
                                        {label: 'Submission Requirement', value: data?.submission_requirement},
                                        {label: 'Delivery Time', value: data?.delivery_time},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Terms and Conditions', value: data?.terms_and_conditions},
                                    ]}
                                    titleA={`RFQ`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <RfqItems
                                    rfq_id={id}
                                    status={data?.status}
                                />
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default RfqView;