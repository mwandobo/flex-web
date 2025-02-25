"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get, post} from "@/utils/api";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import {ReusableButton} from "@/components/button/reusable-button";
import { CheckCircle2} from "lucide-react";
import moneyFormater from "@/components/moneyFormater";
import {
    WORKSHOP_SERVICE_REQUEST_APPROVAL_SLUG
} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const WorkshopServiceView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [maintenance_date, setMaintenanceDate] = useState('')
    const [type, setType] = useState('')
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const toggleModal = (type?: string) => {
        if (type === 'submit') {
            handleSubmit('submit-draft')
        }
    }

    const url = `workshop-service/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: WORKSHOP_SERVICE_REQUEST_APPROVAL_SLUG,
        from: WORKSHOP_SERVICE_REQUEST_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async (url: string) => {
        try {
                const final_url =  `workshop-service/submit/${id}`
                const res = await get(final_url ,token);
                if (data && res.status === 200) {
                    setRefresh(!refresh);
                }

        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = ( path?: string, event?: any) => {
        event?.preventDefault();  // Prevents page reload
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure?`,
            onConfirm: () => onSave(path),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit Request'}
                    onClick={() => toggleModal('submit')}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                    setMaintenanceDate('')
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
                            title={'Workshop Service Request'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Workshop Service Code', value: data?.formatted_code},
                                        {label: 'Service Type', value: data?.service_request_type},
                                        {label: 'Item Name', value: data?.item_name},
                                        {label: 'Description', value: data?.description},
                                        {label: 'Amount', value: moneyFormater({amount: data?.amount})},
                                        {label: 'Warranty Status', value: data?.warranty_status},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Workshop Service Request`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default WorkshopServiceView;