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
import {FileOutput, RotateCcw} from "lucide-react";
import RfqItems from "@/app/procurement/rfq/rfq-items";
import QuotationItems from "@/app/procurement/quotation/quotation-items";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {ITEM_APPROVAL_SLUG, QUOTATION_APPROVAL_SLUG, SALE_QUOTATION_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import DocumentViewer from "@/components/page-components/document-viewer";

const SalesQuotationView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)
    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `quotations/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const approval_url = `approval/approved-items/by-item?from=${SALE_QUOTATION_APPROVAL_SLUG}&&from_id=${id}`

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: SALE_QUOTATION_APPROVAL_SLUG,
        from: SALE_QUOTATION_APPROVAL_SLUG,
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

    const handleSubmit = (data: any) => {
        showConfirmationModal({
            title: 'Are you sure?',
            text: `Are you sure you want to submit Quotation code: ${data.formatted_code}?`,
            onConfirm: onSave,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const onRefresh = async () => {
        try {
            const res = await get(`${url}/refresh-draft`, token);
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleRefresh = (data: any) => {
        showConfirmationModal({
            title: 'Are you sure?',
            text: `Are you sure you want to Refresh Saved Changes for Quotation code: ${data.formatted_code}?`,
            onConfirm: onRefresh,  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))

    const [dataFromChild, setDataFromChild] = useState(null);

    // This function will be passed to the child to receive data
    const sendRefresh = () => {
        console.log('sendRefresh', 'refreshed')
        setRefresh(!refresh);
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
                                        {label: 'Customer Name', value: data?.customer_name},
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
                                />
                                <DocumentViewer data={{ file_url: data.file_url}} />
                                <div className={'flex justify-between mt-2'}>
                                    <>
                                        {approvalButtonsWrapper()}
                                    </>
                                    <SlideOver
                                        showButton={isNeedApprove}
                                        title="Approval Trail">
                                        <TreeList
                                            url={approval_url}
                                        />
                                    </SlideOver>
                                </div>
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <QuotationItems quotation={data}/>
                            </div>
                            {approveStatus() && data?.status === 'pending' &&
                                <div className={'flex justify-end gap-2'}>
                                    <ReusableButton
                                        name={'Refresh Quotation'}
                                        onClick={() => handleRefresh(data)}
                                    >
                                        <RotateCcw size={12}/>
                                    </ReusableButton>
                                    <ReusableButton
                                        name={'Submit Quotation'}
                                        onClick={() => handleSubmit(data)}
                                    >
                                        <FileOutput size={12}/>
                                    </ReusableButton>
                                </div>
                            }
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default SalesQuotationView;