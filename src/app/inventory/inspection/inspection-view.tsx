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
import moneyFormater from "@/components/moneyFormater";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {INSPECTION_APPROVAL_SLUG, SERVICES_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2, FileOutput} from "lucide-react";
import InspectionItems from "@/app/inventory/inspection/inspection-items";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const InspectionView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `inspections/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: INSPECTION_APPROVAL_SLUG,
        from: INSPECTION_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async () => {
        try {
            const res = await get(`${url}/submit-draft`, token);
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
            text: `Are You Sure You Want To Submit Inspection Code: ${data.formatted_code}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit Inspection'}
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
                            title={'Inspection View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Inspection Code', value: data?.formatted_code},
                                        {label: 'Delivery Code', value: data?.formatted_code},
                                        {label: 'Purchase Order', value: data?.purchase_order_name},
                                        {label: 'Request For Quotation', value: data?.rfq_name},
                                        {label: 'Supplier', value: data?.supplier_name},
                                        {label: 'Quotation', value: data?.quotation_name},
                                        {label: 'Inspection By', value: data?.inspected_by},
                                        {
                                            label: 'Inspection Cost',
                                            value: moneyFormater({amount: data?.inspection_cost})
                                        },
                                        {label: 'Inspection Date', value: data?.inspection_date},
                                        {label: 'Description', value: data?.description},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Inspection Code`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <InspectionItems inspection={data}/>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default InspectionView;