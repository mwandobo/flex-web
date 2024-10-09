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
import PurchaseOrderItems from "@/app/procurement/purchase-order/purchase-order-items";
import moneyFormater from "@/components/moneyFormater";
import Payment from "@/app/finance/payment/payment";

const InvoiceView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `invoices/${id}`
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

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                           title={'Invoice'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Invoice Code', value: data?.formatted_code},
                                        {label: 'Purchase Order Code', value: data?.formatted_code},
                                        {label: 'RFQ Code', value: data?.rfq_name},
                                        {label: 'Supplier', value: data?.supplier_name},
                                        {label: 'Quotation Code', value: data?.quotation_name},
                                        {label: 'Payment Method', value: data?.quotation?.payment_method},
                                        {label: 'Paid Amount', value: moneyFormater({amount: data?.paid_amount})},
                                        {label: 'Remaining Amount', value: moneyFormater({amount: data?.remaining_amount})},
                                        {label: 'Total Amount', value: moneyFormater({amount: data?.total_amount})},
                                        {label: 'Status', value: data?.status},

                                    ]}
                                    titleA={`Invoice`}
                                    titleB={` ${data?.formatted_code} `}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <div className={'mt-2'}>
                                <Payment/>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default InvoiceView;