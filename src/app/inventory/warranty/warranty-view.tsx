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
import {CheckCircle2} from "lucide-react";
import {
    WARRANTY_APPROVAL_SLUG
} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import DocumentViewer from "@/components/page-components/document-viewer";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const WarrantyView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `warranties/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: WARRANTY_APPROVAL_SLUG,
        from: WARRANTY_APPROVAL_SLUG,
        from_id: id
    })

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

    console.log(refresh)

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Warranty: ${data.formatted_code}?`,
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

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&


                <ReusableButton
                    name={'Submit Warranty'}
                    onClick={() => handleSubmit()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <CheckCircle2 size={13}/>
                </ReusableButton>
            }
        </>
    }


    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Warranty'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3 flex flex-col">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Warranty Code', value: data?.formatted_code},
                                        {label: 'Warranty Name', value: data?.name},
                                        {
                                            label: data?.from === 'item' ? 'Item Name' : 'Service Name',
                                            value: data?.service_item_name
                                        },
                                        {label: 'Start Date', value: data?.formatted_start_date},
                                        {label: 'End Date', value: data?.formatted_end_date},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Terms', value: data?.terms},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Warranty`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                                <DocumentViewer data={{file_url: data.file_url}}/>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default WarrantyView;