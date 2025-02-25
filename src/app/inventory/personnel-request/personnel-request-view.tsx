"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import {get, post} from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import {
    PERSONNEL_REQUESTS_APPROVAL_SLUG,
} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {FileOutput} from "lucide-react";
import PopupModal from "@/components/modal/popup-modal";
import TextFieldComponent from "@/components/inputs/text-field";
import moneyFormater from "@/components/moneyFormater";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const PersonnelRequestView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)
    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    //modal
    const [amount, setAmount] = useState('')

    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
            setIsModalOpen(!isModalOpen)
    }
    const handleInputChange = (e: any, from?: any) => {
        if (from === 'amount') {
            setAmount(e.target.value)
        }
    }

    const url = `store-requests/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: PERSONNEL_REQUESTS_APPROVAL_SLUG,
        from: PERSONNEL_REQUESTS_APPROVAL_SLUG,
        from_id: id
    })


    const onSave = async (path: string) => {
        try {
            const payload = {
                amount
            }

            let res = null;
            if (path !== 'submit-draft'){
                res = await get(`${url}/${path}`, token);
            } else {
                res = await post(`${url}/${path}`, payload, token);
            }

            if (data && res.status === 200) {
                setRefresh(!refresh);
                setIsModalOpen(false)
            }
        } catch (error: any) {
            console.log(error);
        }
    };


    const handleSubmit = ( path?: string, event?: any) => {
        event?.preventDefault();  // Prevents page reload
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Personnel Request Named: ${data.resource_name}?`,
            onConfirm: () => onSave(path),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const handleItemDispatch = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Dispatch Personnel ${data.resource_name}?`,
            onConfirm: () => onSave(`dispatch`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit Personal Request'}
                    onClick={() => toggleModal()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
                </ReusableButton>
            }
            {data?.status === 'submitted' &&
                <ReusableButton
                    name={'Dispatch Personal Request'}
                    onClick={() => handleItemDispatch()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
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
                            title={'Personnel Request View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Personnel Name', value: data?.resource_name},
                                        {label: 'Requester Name', value: data?.requester_name},
                                        {label: 'Amount', value: moneyFormater({amount: data?.amount, isShowCurrency: true}) },
                                        {label: 'Requested Date', value: data?.formatted_requested_date},
                                        {label: 'Submitted Date', value: data?.formatted_submitted_date},
                                        {label: 'Dispatched Date', value: data?.formatted_dispatched_date},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Personnel Request`}
                                    titleB={` ${data?.resource_name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                        </MuiCardComponent>
                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={toggleModal}
                            isDisabled={false}
                            title={"Personnel Request"}
                        >
                            <form onSubmit={(event) =>handleSubmit('submit-draft', event)}>
                                {
                                    <>
                                        <TextFieldComponent
                                            placeholder={"Amount"}
                                            from={"amount"}
                                            label={"Amount"}
                                            value={amount}
                                            onChange={handleInputChange}
                                            isRequired={true}
                                        />
                                    </>
                                }

                                <div className={'flex gap-2 justify-end'}>
                                    <ReusableButton
                                        name={'Submit'}
                                        type='submit'
                                    />
                                </div>


                                {/* <button type="submit">Upload</button> */}
                            </form>
                        </PopupModal>


                    </>
            }
        </ProtectedRoute>
    );
};

export default PersonnelRequestView;