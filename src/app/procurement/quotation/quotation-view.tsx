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
import {CheckCircle2, FileOutput, RotateCcw} from "lucide-react";
import QuotationItems from "@/app/procurement/quotation/quotation-items";
import { QUOTATION_APPROVAL_SLUG} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import DocumentViewer from "@/components/page-components/document-viewer";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const QuotationView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)
    const {state} = useGlobalContextHook()
    const { viewedItem} = state;
    const {id} = viewedItem;

    const url = `quotations/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: QUOTATION_APPROVAL_SLUG,
        from: QUOTATION_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async (url:string) => {
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
            title: 'Are you sure?',
            text: `Are you sure you want to submit Quotation code: ${data.formatted_code}?`,
            onConfirm: () =>  onSave(`${url}/submit-draft`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleRefresh = () => {
        showConfirmationModal({
            title: 'Are you sure?',
            text: `Are you sure you want to Refresh Saved Changes for Quotation code: ${data.formatted_code}?`,
            onConfirm: () =>  onSave(`${url}/refresh-draft`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <div className={'flex justify-end gap-2'}>
                    <ReusableButton
                        name={'Refresh'}
                        onClick={() => handleRefresh()}
                        rounded={'md'}
                        padding={'p-3'}
                        shadow={'shadow-md'}
                        bg_color={'bg-gray-50'}
                        hover={'hover:bg-gray-200 hover:border-gray-400'}
                        hover_text={'hover:text-gray-900 hover:font-semibold'}
                        border={'border border-gray-300'}
                        text_color={'text-gray-700'}
                    >
                        <RotateCcw size={13}/>
                    </ReusableButton>

                    <ReusableButton
                        name={'Submit Quotation'}
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
                </div>
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
                            title={'Quotation View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Quotation Code', value: data?.formatted_code},
                                        {label: 'Supplier', value: data?.supplier_name},
                                        {label: 'Request for Quotation Code', value: data?.rfq_name},
                                        {label: 'Payment Method', value: data?.payment_method},
                                        {label: 'Evaluation Method', value: data?.evaluation_method},
                                        {label: 'Decision Timeline', value: data?.decision_timeline},
                                        {label: 'Submission Requirement', value: data?.submission_requirement},
                                        {label: 'Delivery Time', value: data?.delivery_time},
                                        {label: 'status', value: data?.status},
                                        {label: 'Terms and Conditions', value: data?.terms_and_conditions},
                                    ]}
                                    titleA={`Quotation`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                                <DocumentViewer data={{ file_url: data.file_url}} />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <QuotationItems quotation={data}/>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default QuotationView;