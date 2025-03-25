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
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import { SOLD_ITEMS_APPROVAL_SLUG} from "@/utils/constant";
import Warranty from "@/app/inventory/warranty/warranty";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {ReusableButton} from "@/components/button/reusable-button";
import {Banknote, CheckCircle2} from "lucide-react";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import PopupModal from "@/components/modal/popup-modal";
import MuiSelect from "@/components/inputs/mui-select";

const SoldItemsView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')


    //modal

    const [cost_center_id, setCostCenterId] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = (type?: string) => {
        setIsModalOpen(!isModalOpen);
    }

    const handleInputChange = (e: any, from?: any) => {
        if (from === 'cost_center_id') {
            setCostCenterId(e.target.value)
        }
    }


    const {state,} = useGlobalContextHook()
    const { viewedItem} = state;
    const {id,} = viewedItem;

    const url = `purchase-orders/sold-items/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: SOLD_ITEMS_APPROVAL_SLUG,
        from: SOLD_ITEMS_APPROVAL_SLUG,
        from_id: id
    })

    const formInputs = [
        {
            name: 'quantity',
            type: 'text',
            label: 'Quantity',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const {
        createdForm,
        isStateChanged
    } = useCrudOperator({
        formInputData: formInputs,
        incomingUrl: `requisition-request/item/${id}`,
        incomingModalTitle: "Requisition Request",
        viewUrl:"",
        state_properties:[],
        from:'item-requisition',
        isApiV2:true
    })

    const onSave = async (path: string) => {
        try {
            const  res = await post(path,{cost_center_id}, token);
            if ( res.status === 200) {
                setRefresh(!refresh);
                setIsModalOpen(false)
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = ( event?: any) => {
        event?.preventDefault();  // Prevents page reload
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Delivery Named: ${data.name}?`,
            onConfirm: () => onSave(`purchase-orders/sold-items/${data?.order_item_id}/update-cost-center`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };

    const buttonsBody = () => {
        return <>
            <div className="flex gap-2 justify-end">

                {data.order_item_status === 'pending' &&
                    <>
                        <ReusableButton
                            name={'Update Cost Center'}
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
                            <Banknote size={13}/>
                        </ReusableButton>
                    </>
                }
            </div>
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
    }, [isStateChanged, refresh])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                           title={'Sold Item View'}
                           isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Sale Order', value: data?.sale_order_name},
                                        {label: 'Item Name', value: data?.name},
                                        {label: 'Item Category', value: data?.category_name},
                                        {label: 'Project', value: data?.project_name},
                                        {label: 'Quantity', value: data?.quantity},
                                        {label: 'Price', value: data?.price},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Warranty Status', value: data?.warrant_status},
                                    ]}
                                    titleA={`Sold Item`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody:buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <Warranty from={'sold-items'} from_id={data?.order_item_id} is_warranted={data.is_warranted}/>
                        </MuiCardComponent>
                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={toggleModal}
                            isDisabled={false}
                            title={"Deliverable"}
                        >
                            <form onSubmit={(event) => handleSubmit( event)}>
                                {
                                    <>
                                        <MuiSelect
                                            handleChange={handleInputChange}
                                            from={'cost_center_id'}
                                            label={'Select Cost Center'}
                                            optionsUrlData={'cost-centers'}
                                            optionDataKey={'departments'}
                                            value={cost_center_id}
                                            error={''}
                                            isDisabled={false}
                                            isRequired={true}
                                        />

                                    </>
                                }

                                <div className={'flex gap-2 justify-end'}>
                                    <ReusableButton
                                        name={'Submit '}
                                        type='submit'
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
                                </div>

                            </form>
                        </PopupModal>                    </>
            }
        </ProtectedRoute>
    );
};

export default SoldItemsView;