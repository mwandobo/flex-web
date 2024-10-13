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
import {useApprovalHook} from "@/hooks/useApprove";
import {ITEM_APPROVAL_SLUG, SUPPLIER_APPROVAL_SLUG} from "@/utils/constant";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";

const SuppliersView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `suppliers/${id}`
    const approval_url = `approval/approved-items/by-item?from=${SUPPLIER_APPROVAL_SLUG}&&from_id=${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: SUPPLIER_APPROVAL_SLUG,
        from: SUPPLIER_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))
    
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
                           title={'Supplier View'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Supplier Name', value: data?.name},
                                        {label: 'Supplier Phone', value: data?.phone},
                                        {label: 'Supplier Email', value: data?.email},
                                        {label: 'Supplier Categories', value: data?.category_name},
                                    ]}
                                    titleA={`Supplier`}
                                    titleB={` ${data?.name} `}
                                />
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
                    </>
            }
        </ProtectedRoute>
    );
};

export default SuppliersView;