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
import RequisitionRequestItem from "@/app/procurement/requisition-requests/requisition-request-items";
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2} from "lucide-react";
import { REQUISITION_REQUEST_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const RequisitionRequestView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `requisition-request/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: REQUISITION_REQUEST_APPROVAL_SLUG,
        from: REQUISITION_REQUEST_APPROVAL_SLUG,
        from_id: id
    })


    const formInputs = [
        {
            name: 'payment_method',
            type: 'text',
            label: 'Payment Method',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'evaluation_method',
            type: 'text',
            label: 'Evaluation Method',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'decision_timeline',
            type: 'text',
            label: 'Decision Timeline',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'submission_requirement',
            type: 'text',
            label: 'Submission Requirement',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'delivery_time',
            type: 'text',
            label: 'Deliver Time',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
        {
            name: 'terms_and_conditions',
            type: 'textArea',
            label: 'Terms and Conditions',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const {
        handleClick,
        createdForm,
        isStateChanged
    } = useCrudOperator({
        formInputData: formInputs,
        incomingUrl: `rfq/${id}/create-rfq`,
        incomingModalTitle: "Request For  Quotation",
        viewUrl: "",
        state_properties: [],
        from: 'rfq',
        isApiV2: true
    })

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
    }, [isStateChanged])

    const buttonsBody = () => {
        return <>

            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Request for Quotation'}
                    onClick={() => handleClick('create')}
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
                            title={'Requisition Request View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Requisition Request Code', value: data?.formatted_code},
                                        {label: 'Store', value: data?.store_name},
                                        {label: 'Store Keeper', value: data?.store_keeper},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Requisition Request`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <RequisitionRequestItem
                                    requisition_request_id={id}
                                    status={data.status}
                                />
                            </div>
                        </MuiCardComponent>
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    );
};

export default RequisitionRequestView;