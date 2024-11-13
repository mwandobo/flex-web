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
import moneyFormater from "@/components/moneyFormater";
import {DELIVERY_APPROVAL_SLUG, EQUIPMENT_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {ReusableButton} from "@/components/button/reusable-button";
import {FileOutput} from "lucide-react";
import DeliveryItems from "@/app/inventory/delivery/delivery-items";
import PopupModal from "@/components/modal/popup-modal";
import MuiSelect from "@/components/inputs/mui-select";
import TextFieldComponent from "@/components/inputs/text-field";
import MuiDate from "@/components/inputs/mui-date";
import TextArea from "@/components/inputs/text-area";
import EquipmentItems from "@/app/inventory/equipment/equipment-items";

const EquipmentView = () => {
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const [refresh, setRefresh] = useState(false)

    const [type, setType] = useState('')
    const [description, setDescription] = useState('')
    const [user_id, setUserId] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = (type?: string) => {
        setIsModalOpen(true)
        setType(type)
    }

    const handleInputChange = (e: any, from?: any) => {
        if (from === 'description') {
            setDescription(e.target.value)
        }
        if (from === 'user_id') {
            setUserId(e.target.value)
        }
    }

    const {state} = useGlobalContextHook()
    const {viewedItem} = state;
    const {id} = viewedItem;

    const url = `equipment/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const approval_url = `approval/approved-items/by-item?from=${EQUIPMENT_APPROVAL_SLUG}&&from_id=${id}`

    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: EQUIPMENT_APPROVAL_SLUG,
        from: EQUIPMENT_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))

    const onSave = async () => {
        try {
            const bufferUrl = () => {
                switch (type){
                    case 'assign' : return `equipment/${id}/assign`
                    case 'defective' : return `equipment/${id}/defective`
                    case 'fixed' : return `equipment/${id}/fixed`
                    case 'return' : return `equipment/${id}/return`
                    default: return ''
                }
            }
            const res = await post(bufferUrl(), {user_id, description}, token);
            if (data && res.status === 200) {
                setRefresh(!refresh);
                setIsModalOpen(false)
                clearFormData()
            }
        } catch (error: any) {
            setRefresh(!refresh);
            console.log(error);
        }
    };

    const clearFormData = ( ) =>{
        setDescription('')
        setUserId('')
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const bufferSms = () => {
            switch (type){
                case 'assign' : return `Are You Sure You Want To Assign User to Equipment ${data?.name}`
                case 'defective' : return `Are You Sure You Want Mark Equipment ${data?.name} as Defective`
                case 'fixed' : return `Are You Sure You Want Mark Equipment ${data?.name} as Fixed`
                case 'return' : return `Are You Sure You Want To Mark Equipment ${data?.name} as returned`
                default: return ''
            }
        }
        showConfirmationModal({
            title: 'Are You Sure?',
            text: bufferSms()  ,
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

    console.log(data)

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Equipment View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Equipment Name', value: data?.name},
                                        {label: 'Equipment Serial Number', value: data?.formatted_code},
                                        {label: 'Quantity', value: data?.quantity},
                                        {label: 'Description', value: data?.description},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Equipment`}
                                    titleB={` ${data?.name} `}
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
                            {
                                approveStatus() &&
                                <div className={'flex justify-end gap-2 mt-2'}>

                                    {(data.status === 'pending' || data.status === 'fixed') &&
                                        <ReusableButton
                                            name={'Assign'}
                                            onClick={() => toggleModal('assign')}
                                        >
                                            <FileOutput size={12}/>
                                        </ReusableButton>
                                    }

                                    {data.status !== 'defective' &&
                                            <ReusableButton
                                                name={'Mark Defective'}
                                                onClick={() => toggleModal('defective')}
                                            >
                                                <FileOutput size={12}/>
                                            </ReusableButton>
                                    }
                                    {data.status === 'defective' &&
                                        <ReusableButton
                                            name={'Mark As Fixed'}
                                            onClick={() => toggleModal('fixed')}
                                        >
                                            <FileOutput size={12}/>
                                        </ReusableButton>
                                    }
                                    {data.status === 'in-use' &&
                                        <>
                                            <ReusableButton
                                                name={'Return'}
                                                onClick={() => toggleModal('return')}
                                            >
                                                <FileOutput size={12}/>
                                            </ReusableButton>
                                        </>
                                    }
                                </div>
                            }
                            <hr className="bg-gray-100"/>
                            <EquipmentItems equipment={data}/>
                        </MuiCardComponent>
                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={toggleModal}
                            isDisabled={false}
                            title={"Deliverable"}
                        >
                            <form onSubmit={(event) => handleSubmit(event)}>
                                {
                                    <>
                                        {type === 'assign' &&
                                            <MuiSelect
                                                handleChange={handleInputChange}
                                                from={'user_id'}
                                                label={'User'}
                                                optionsUrlData={'employee'}
                                                optionDataKey={'users'}
                                                value={user_id}
                                                error={''}
                                                isDisabled={false}
                                                isRequired={true}
                                            />
                                        }
                                        <TextArea
                                            placeholder={"Notes"}
                                            from={"description"}
                                            label={"Notes"}
                                            value={description}
                                            onChange={handleInputChange}
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

export default EquipmentView;