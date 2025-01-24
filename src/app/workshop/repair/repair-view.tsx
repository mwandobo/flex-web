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
import {useApprovalHook} from "@/hooks/useApprove";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";
import DocumentViewer from "@/components/page-components/document-viewer";
import {REPAIR_APPROVAL_SLUG} from "@/utils/constant";

const RepairView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state} = useGlobalContextHook()
    const {viewedItem} = state;
    const {id} = viewedItem;

    const url = `repair/${id}`
    const approval_url = `approval/approved-items/by-item?from=${REPAIR_APPROVAL_SLUG}&&from_id=${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: REPAIR_APPROVAL_SLUG,
        from: REPAIR_APPROVAL_SLUG,
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
            text: `Are You Sure You Want To Submit Repair Code: ${data.formatted_code}?`,
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
                            title={'Repair'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Maintenance Code', value: data?.formatted_code},
                                        {label: 'Maintenance Amount', value:  moneyFormater({amount:data?.amount}) },
                                        {label: 'Maintenance Handler', value: data?.handler_name},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Repair`}
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

export default RepairView;