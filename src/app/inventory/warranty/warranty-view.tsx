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
import {FileOutput} from "lucide-react";
import RfqItems from "@/app/procurement/rfq/rfq-items";
import QuotationItems from "@/app/procurement/quotation/quotation-items";
import PurchaseOrderItems from "@/app/procurement/purchase-order/purchase-order-items";
import moneyFormater from "@/components/moneyFormater";
import Payment from "@/app/finance/payment/payment";
import {
    COST_CENTER_APPROVAL_SLUG,
    INVOICE_APPROVAL_SLUG,
    ITEM_APPROVAL_SLUG,
    SERVICES_APPROVAL_SLUG, WARRANTY_APPROVAL_SLUG
} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";

const WarrantyView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `warranties/${id}`
    const approval_url = `approval/approved-items/by-item?from=${WARRANTY_APPROVAL_SLUG}&&from_id=${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: WARRANTY_APPROVAL_SLUG,
        from: WARRANTY_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))

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

    console.log(refresh)

    const handleSubmit = (data: any) => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Warranty: ${data.formatted_code}?`,
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

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Service'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Warranty Code', value: data?.formatted_code},
                                        {label: 'Warranty Name', value: data?.name},
                                        {label: 'Service Name', value:  moneyFormater({amount:data?.cost}) },
                                        {label: 'Start Date', value: data?.formatted_start_date},
                                        {label: 'End Date', value: data?.formatted_end_date},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Terms', value: data?.terms},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Service`}
                                    titleB={` ${data?.formatted_code} `}
                                />
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

                            <hr className="bg-gray-100"/>
                            {approveStatus() && data?.status === 'pending' &&
                                <div className={'flex justify-end gap-2 mt-2'}>
                                    <ReusableButton
                                        name={'Submit Warranty'}
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

export default WarrantyView;