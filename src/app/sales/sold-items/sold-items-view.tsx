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
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {useApprovalHook} from "@/hooks/useApprove";
import {ITEM_APPROVAL_SLUG} from "@/utils/constant";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import Warranty from "@/app/inventory/warranty/warranty";

const SoldItemsView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `purchase-orders/sold-items/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const approval_url = `approval/approved-items/by-item?from=${ITEM_APPROVAL_SLUG}&&from_id=${id}`

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: ITEM_APPROVAL_SLUG,
        from: ITEM_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))

    const formInputs = [
        {
            name: 'quantity',
            type: 'text',
            label: 'Quantity',
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
        incomingUrl: `requisition-request/item/${id}`,
        incomingModalTitle: "Requisition Request",
        viewUrl:"",
        state_properties:[],
        from:'item-requisition',
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
    }, [isStateChanged])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                           title={'Item View'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Purchase Order', value: data?.purchase_order_name},
                                        {label: 'Item Name', value: data?.name},
                                        {label: 'Item Category', value: data?.category_name},
                                        {label: 'Quantity', value: data?.rfq_quantity},
                                        {label: 'Price', value: data?.price},
                                        {label: 'Warranty Status', value: data?.warrant_status},
                                    ]}
                                    titleA={`Item`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <Warranty from={'sold-items'} from_id={data?.order_item_id} is_warranted={data.is_warranted}/>
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
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    );
};

export default SoldItemsView;