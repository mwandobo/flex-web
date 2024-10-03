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
import RequisitionRequestItem from "@/app/procurement/requisition-requests/requisition-request-items";
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {ReusableButton} from "@/components/button/reusable-button";
import {FileOutput} from "lucide-react";
import RfqItems from "@/app/procurement/rfq/rfq-items";
import QuotationItems from "@/app/procurement/quotation/quotation-items";

const QuotationView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `quotations/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

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
        incomingModalTitle: "Request For Quotation",
        viewUrl:"",
        state_properties:[],
        from:'rfq',
        isApiV2:true
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
    }, [])

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
                                        {label: 'Terms and Conditions', value: data?.terms_and_conditions},

                                    ]}
                                    titleA={`Quotation`}
                                    titleB={` ${data?.formatted_code} `}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <QuotationItems quotation_id={id}/>
                            </div>

                        </MuiCardComponent>
                        {createdForm()}

                    </>
            }
        </ProtectedRoute>
    );
};

export default QuotationView;