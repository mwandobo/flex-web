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
import {Ellipsis, ShoppingCart} from "lucide-react";
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {useApprovalHook} from "@/hooks/useApprove";
import {ITEM_APPROVAL_SLUG} from "@/utils/constant";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";

const ItemsView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `item/${id}`

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
    }, [])

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
                                        {label: 'Item Name', value: data?.name},
                                        {label: 'Item Category', value: data?.category_name},
                                        {label: 'Quantity', value: data?.quantity},
                                        {label: 'Price', value: data?.price},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Item`}
                                    titleB={` ${data?.name} `}
                                />
                                <div className="flex flex-col items-end">
                                    <ReusableButton
                                        name={'Add Item to Requisition Request'}
                                        onClick={() => handleClick('create')}
                                    >
                                        <ShoppingCart size={12}/>
                                    </ReusableButton>
                                </div>
                            </div>
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

export default ItemsView;