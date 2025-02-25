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
import {CheckCircle, CheckCircle2, ShoppingCart} from "lucide-react";
import {DELIVERABLE_APPROVAL_SLUG,} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import PopupModal from "@/components/modal/popup-modal";
import TextFieldComponent from "@/components/inputs/text-field";
import TextArea from "@/components/inputs/text-area";
import MuiSelect from "@/components/inputs/mui-select";
import MuiDate from "@/components/inputs/mui-date";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const ItemDeliverableView = () => {
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    //modal
    const [amount, setAmount] = useState('')
    const [quantity, setQuantity] = useState('')
    const [type, setType] = useState('')
    const [start_date, setStartDate] = useState('')
    const [end_date, setEndDate] = useState('')
    const [description, setDescription] = useState('')
    const [category_id, setCategoryId] = useState('')
    const [pricing, setPricing] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = (type?: string) => {
        if (type === 'submit') {
            handleSubmit('submit-draft')
        } else {
            setIsModalOpen(!isModalOpen)
            setType(type)
        }

    }
    const handleInputChange = (e: any, from?: any) => {
        if (from === 'amount') {
            setAmount(e.target.value)
        }
        if (from === 'pricing') {
            setPricing(e.target.value)
        }
        if (from === 'quantity') {
            setQuantity(e.target.value)
        }
        if (from === 'category_id') {
            setCategoryId(e.target.value)
        }
        if (from === 'description') {
            setDescription(e.target.value)
        }
        if (from === 'start_date') {
            setStartDate(e.target.value)
        }
        if (from === 'end_date') {
            setEndDate(e.target.value)
        }
    }

    const {state} = useGlobalContextHook()
    const {viewedItem} = state;
    const {id} = viewedItem;

    const url = `deliverable/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: DELIVERABLE_APPROVAL_SLUG,
        from: DELIVERABLE_APPROVAL_SLUG,
        from_id: id
    })


    const onSave = async (path: string) => {
        try {
            const payload = {
                amount, quantity, description, category_id, type, start_date, end_date
            }

            let res = null;
            if (path === 'submit-draft') {
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

    const handleSubmit = (path?: string, event?: any) => {
        event?.preventDefault();  // Prevents page reload
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Delivery Named: ${data.name}?`,
            onConfirm: () => onSave(path),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };


    const buttonsBody = () => {
        return <>
            <div className="flex gap-2 justify-end">

                {data.status === 'submitted' && Number(data.activity_progress) >= 80 ?
                    <>
                        <ReusableButton
                            name={'Move to Services'}
                            onClick={() => toggleModal('service')}
                            rounded={'md'}
                            padding={'p-3'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <ShoppingCart size={13}/>
                        </ReusableButton>
                        <ReusableButton
                            name={'Move to Items'}
                            onClick={() => toggleModal('item')}
                            rounded={'md'}
                            padding={'p-3'}
                            shadow={'shadow-md'}
                            bg_color={'bg-gray-50'}
                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                            border={'border border-gray-300'}
                            text_color={'text-gray-700'}
                        >
                            <ShoppingCart size={13}/>
                        </ReusableButton>
                    </> : <>
                        {data.status === 'pending' ?
                            <>
                                <ReusableButton
                                    name={'Submit Deliverable'}
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
                                    <CheckCircle size={13}/>
                                </ReusableButton>
                            </> :

                            <>
                                {(data.status !== 'moved to service' && data.status !== 'moved to item') && (
                                    <p className={'text-xs text-gray-500'}>
                                        Waiting For Activity to Reach 80% to be moved to Sale Items
                                    </p>
                                )}
                            </>

                        }
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
    }, [refresh])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Deliverable View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Deliverable Name', value: data?.name},
                                        {label: 'Project Name', value: data?.project_name},
                                        {label: 'Activity Name', value: data?.activity_name},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Description', value: data?.description},
                                        {label: 'Activity Progress', value: `${data?.activity_progress}%`},
                                    ]}
                                    titleA={`Deliverable`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}

                                />

                            </div>
                            <hr className="bg-gray-100"/>
                        </MuiCardComponent>
                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={toggleModal}
                            isDisabled={false}
                            title={"Deliverable"}
                        >
                            <form onSubmit={(event) => handleSubmit('move', event)}>
                                {
                                    <>
                                        {type === 'item' && <MuiSelect
                                            handleChange={handleInputChange}
                                            from={'category_id'}
                                            label={'Item Category'}
                                            optionsUrlData={'items-categories'}
                                            optionDataKey={'departments'}
                                            value={category_id}
                                            error={''}
                                            isDisabled={false}
                                            isRequired={true}
                                        />}
                                        <TextFieldComponent
                                            placeholder={"Amount"}
                                            from={"amount"}
                                            label={"Amount"}
                                            value={amount}
                                            onChange={handleInputChange}
                                            isRequired={true}
                                        />

                                        {type === 'item' &&
                                            <>
                                                <MuiSelect
                                                    handleChange={handleInputChange}
                                                    from={'pricing'}
                                                    label={'Pricing'}
                                                    optionsUrlData={'pricing'}
                                                    optionDataKey={'departments'}
                                                    value={pricing}
                                                    error={''}
                                                    isDisabled={false}
                                                    isRequired={true}
                                                />
                                                <TextFieldComponent
                                                    placeholder={"Quantity"}
                                                    from={"quantity"}
                                                    label={"Quantity"}
                                                    value={quantity}
                                                    onChange={handleInputChange}

                                                    isRequired={true}
                                                />
                                            </>
                                        }
                                        {type === 'service' && <>
                                            <MuiDate
                                                handleDateChange={handleInputChange}
                                                from={'start_date'}
                                                label={"Start Date"}
                                                value={start_date}
                                                // minDate={item.minDate}
                                                // maxDate={item.maxDate}
                                                // defaultValue={item.defaultDate}
                                                isDisabled={false}
                                            />
                                            <MuiDate
                                                handleDateChange={handleInputChange}
                                                from={'end_date'}
                                                label={"End Date"}
                                                value={end_date}
                                                // minDate={item.minDate}
                                                // maxDate={item.maxDate}
                                                // defaultValue={item.defaultDate}
                                                isDisabled={false}
                                            />
                                        </>
                                        }
                                        <TextArea
                                            placeholder={"Description"}
                                            from={"description"}
                                            label={"Description"}
                                            value={description}
                                            onChange={handleInputChange}
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
                        </PopupModal>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ItemDeliverableView;