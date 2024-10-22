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
import {ReusableButton} from "@/components/button/reusable-button";
import {FileOutput} from "lucide-react";
import moneyFormater from "@/components/moneyFormater";
import Payment from "@/app/finance/payment/payment";
import {INVOICE_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";
import DocumentViewer from "@/components/page-components/document-viewer";

const InvoiceView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state} = useGlobalContextHook()
    const {viewedItem} = state;
    const {id} = viewedItem;

    const url = `invoices/${id}`
    const approval_url = `approval/approved-items/by-item?from=${INVOICE_APPROVAL_SLUG}&&from_id=${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: INVOICE_APPROVAL_SLUG,
        from: INVOICE_APPROVAL_SLUG,
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
            text: `Are You Sure You Want To Submit Invoice Code: ${data.formatted_code}?`,
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
                            title={'Invoice'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Invoice Code', value: data?.formatted_code},
                                        {label: 'Invoice Type', value: capitalizeFirstWord(data?.type)},
                                        {label: 'Purchase Order Code', value: data?.formatted_code},
                                        {label: 'RFQ Code', value: data?.rfq_name},
                                        {label: data?.supplier_name ? 'Supplier' : 'Customer', value: data?.supplier_name || data?.customer_name},
                                        {label: 'Quotation Code', value: data?.quotation_name},
                                        {label: 'Payment Method', value: data?.quotation?.payment_method},
                                        {label: 'Paid Amount', value: moneyFormater({amount: data?.paid_amount})},
                                        {
                                            label: 'Remaining Amount',
                                            value: moneyFormater({amount: data?.remaining_amount})
                                        },
                                        {label: 'Total Amount', value: moneyFormater({amount: data?.total_amount})},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Invoice`}
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
                            {
                                approveStatus() && data?.status === 'payment' &&

                                <div className={'mt-2'}>
                                    <Payment
                                        invoice={data}
                                    />
                                </div>
                            }
                            <hr className="bg-gray-100"/>
                            {approveStatus() && data?.status === 'pending' &&
                                <div className={'flex justify-end gap-2 mt-2'}>
                                    <ReusableButton
                                        name={'Submit Invoice'}
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

export default InvoiceView;