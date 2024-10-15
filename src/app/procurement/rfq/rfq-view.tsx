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
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {ITEM_APPROVAL_SLUG, REQUEST_FOR_QUOTATION_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import Swal from "sweetalert2";

const RfqView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `rfq/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const approval_url = `approval/approved-items/by-item?from=${REQUEST_FOR_QUOTATION_APPROVAL_SLUG}&&from_id=${id}`

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: REQUEST_FOR_QUOTATION_APPROVAL_SLUG,
        from: REQUEST_FOR_QUOTATION_APPROVAL_SLUG,
        from_id: id
    })

    function showConfirmationModal(data:any) {
        Swal.fire({
            title: `Are you sure ?`,
            text: `Are you sure you want to submit Rfq code: ${data.formatted_code} ?`,
            icon: 'warning',
            showCancelButton: true,  // Shows the "No" button
            confirmButtonText: 'Yes',  // Text for the "Yes" button
            cancelButtonText: 'No',    // Text for the "No" button
            reverseButtons: true,
            customClass: {
                actions: 'flex justify-between w-full', // Custom class for action buttons
                confirmButton: 'mx-4 px-4 py-2 bg-green-500 text-white rounded',
                cancelButton: 'mx-4 px-4 py-2 bg-red-500 text-white rounded',
            },
            buttonsStyling: false,// Optional: swaps the order of the buttons
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle the "Yes" action
                onSave()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Handle the "No" action
                console.log('User canceled the action');
            }
        });
    }


    const onSave = async () => {
        try {
            const res = await get(`${url}/submit-draft`, token)
            if (data && res.status === 200) {
                setRefresh(!refresh)
            }

        } catch (error: any) {
            console.log(Error)
        }
    }

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
    }, [refresh])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'RFQ View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Request for Quotation Code', value: data?.formatted_code},
                                        {label: 'Payment Method', value: data?.payment_method},
                                        {label: 'Evaluation Method', value: data?.evaluation_method},
                                        {label: 'Decision Timeline', value: data?.decision_timeline},
                                        {label: 'Submission Requirement', value: data?.submission_requirement},
                                        {label: 'Delivery Time', value: data?.delivery_time},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Terms and Conditions', value: data?.terms_and_conditions},

                                    ]}
                                    titleA={`RFQ`}
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
                            <div className={'mt-2'}>
                                <RfqItems
                                    rfq_id={id}
                                    status={data?.status}
                                />
                            </div>
                            {approveStatus() && data?.status ==='pending' &&
                                <div className={'flex justify-end'}>
                                    <ReusableButton
                                        name={'Submit RFQ'}
                                        onClick={() => showConfirmationModal(data)}
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

export default RfqView;