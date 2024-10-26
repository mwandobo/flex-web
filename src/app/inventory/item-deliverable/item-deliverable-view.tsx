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
import { ShoppingCart} from "lucide-react";
import {useApprovalHook} from "@/hooks/useApprove";
import {DELIVERY_APPROVAL_SLUG} from "@/utils/constant";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import Warranty from "@/app/inventory/warranty/warranty";
import {showConfirmationModal} from "@/utils/showAlertDialog";

const ItemDeliverableView = () => {
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state} = useGlobalContextHook()
    const {viewedItem} = state;
    const {id} = viewedItem;

    const url = `deliverable/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const approval_url = `approval/approved-items/by-item?from=${DELIVERY_APPROVAL_SLUG}&from_id=${id}`

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: DELIVERY_APPROVAL_SLUG,
        from: DELIVERY_APPROVAL_SLUG,
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

    const handleSubmit = (data: any) => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Delivery Code: ${data.formatted_code}?`,
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
    }, [])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                           title={'Deliverable View'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Deliverable Name', value: data?.name},
                                        {label: 'Project Name', value: data?.project_name},
                                        {label: 'Activity Name', value: data?.activity_name},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Deliverable`}
                                    titleB={` ${data?.name} `}
                                />
                                {
                                    approveStatus() && <div className="flex gap-2 justify-end">
                                        <ReusableButton
                                            name={'Move to Services'}
                                            onClick={() => handleSubmit('create')}
                                        >
                                            <ShoppingCart size={12}/>
                                        </ReusableButton>
                                        <ReusableButton
                                            name={'Move to Items'}
                                            onClick={() => handleSubmit('create')}
                                        >
                                            <ShoppingCart size={12}/>
                                        </ReusableButton>
                                    </div>
                                }
                            </div>
                            <hr className="bg-gray-100"/>
                            <hr className="bg-gray-100"/>
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
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ItemDeliverableView;