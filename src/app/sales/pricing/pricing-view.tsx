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
import { PRICING_APPROVAL_SLUG,} from "@/utils/constant";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const PricingView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state} = useGlobalContextHook()
    const { viewedItem} = state;
    const {id} = viewedItem;

    const url = `pricing/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: PRICING_APPROVAL_SLUG,
        from: PRICING_APPROVAL_SLUG,
        from_id: id
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
                            title={'Pricing View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Pricing Name', value: data?.name},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Pricing`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({})}
                                />
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default PricingView;