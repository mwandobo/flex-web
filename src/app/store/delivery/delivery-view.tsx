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
import DeliveryItems from "@/app/store/delivery/delivery-items";
import moneyFormater from "@/components/moneyFormater";

const DeliveryView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `deliveries/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
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
    }, [])

    console.log(data)

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Delivery View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Delivery Code', value: data?.formatted_code },
                                        { label: 'Purchase Order', value: data?.purchase_order_name },
                                        { label: 'Request For Quotation', value: data?.rfq_name },
                                        { label: 'Supplier', value: data?.supplier_name },
                                        { label: 'Quotation', value: data?.quotation_name },
                                        { label: 'Delivery Cost', value: moneyFormater({amount:data?.delivery_cost })  },
                                        { label: 'Delivery Date', value: data?.delivery_date },
                                        { label: 'Delivery Date', value: data?.delivery_date },
                                        { label: 'Delivery Address', value: data?.delivery_address },
                                        { label: 'Description', value: data?.description },
                                        { label: 'Status', value: data?.status },
                                    ]}
                                    titleA={`Delivery`}
                                    titleB={` ${data?.formatted_code} `}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                            <DeliveryItems delivery_id={id}/>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default DeliveryView;