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
import RequisitionRequestItem from "@/app/procurement/requisition-requests/requisition-request-items";
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCheck, FileOutput, NotebookPen} from "lucide-react";
import RfqItems from "@/app/procurement/rfq/rfq-items";
import QuotationItems from "@/app/procurement/quotation/quotation-items";
import PurchaseOrderItems from "@/app/procurement/purchase-order/purchase-order-items";
import moneyFormater from "@/components/moneyFormater";
import Payment from "@/app/finance/payment/payment";
import {
    COST_CENTER_APPROVAL_SLUG,
    INVOICE_APPROVAL_SLUG,
    ITEM_APPROVAL_SLUG,
    MAINTENANCE_APPROVAL_SLUG
} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import PopupModal from "@/components/modal/popup-modal";
import MuiSelect from "@/components/inputs/mui-select";
import TextFieldComponent from "@/components/inputs/text-field";
import MuiDate from "@/components/inputs/mui-date";
import TextArea from "@/components/inputs/text-area";
import moment from "moment";
import dayjs from "dayjs";
import EquipmentItems from "@/app/inventory/equipment/equipment-items";
import MaintenanceHistory from "@/app/workshop/maintenance-notes";

const MaintenanceView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [maintenance_date, setMaintenanceDate] = useState('')
    const [notes, setNotes] = useState('')
    const [type, setType] = useState('')
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

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
        if (from === 'maintenance_date') {
            setMaintenanceDate(e.target.value)
        }
        if (from === 'notes') {
            setNotes(e.target.value)
        }
    }



    const url = `maintenance/${id}`
    const approval_url = `approval/approved-items/by-item?from=${MAINTENANCE_APPROVAL_SLUG}&&from_id=${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }
    const {
        isNeedApprove,
        isLastLevel,
        latestApproveStatus,
        approvalButtonsWrapper,
    } = useApprovalHook({
        approval_slug: MAINTENANCE_APPROVAL_SLUG,
        from: MAINTENANCE_APPROVAL_SLUG,
        from_id: id
    })

    const approveStatus = () => (!isNeedApprove || (isLastLevel && latestApproveStatus === 'approve'))

    const onSave = async (url: string) => {
        try {
                const final_url =  `maintenance/${id}/${url}?type=${type}`
                const res = await post(final_url, {notes, date: maintenance_date ? maintenance_date: dayjs().format('YYYY-MM-DD')} ,token);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                    setIsModalOpen(false)
                    setNotes('')
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
                            title={'Maintenance'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Maintenance Code', value: data?.formatted_code},
                                        {label: 'Maintenance Item', value: data?.maintenance_item_name},
                                        {label: 'Description', value: data?.description},
                                        {label: 'Maintenance Cost', value: moneyFormater({amount: data?.amount})},
                                        {label: 'Maintained Type', value: data?.maintenance_type},
                                        {label: 'Maintained By', value: data?.maintained_by_name},
                                        {label: 'Warranty Status', value: data?.warranty_status},
                                        {label: 'Status', value: data?.status},
                                    ]}
                                    titleA={`Maintenance`}
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
                            <hr className="bg-gray-100"/>
                            {approveStatus() && data?.status === 'pending' &&
                                <div className={'flex justify-end gap-2 mt-2'}>
                                    <ReusableButton
                                        name={'Start Maintenance'}
                                        onClick={() => toggleModal('start_maintenance')}
                                    >
                                        <FileOutput size={12}/>
                                    </ReusableButton>
                                </div>
                            }

                            {approveStatus() && data?.status === 'in-progress' &&
                                <div className={'flex justify-end gap-2 my-2'}>
                                    <ReusableButton
                                        name={'Add Notes'}
                                        onClick={() => toggleModal('add_note')}
                                    >
                                        <NotebookPen size={12}/>
                                    </ReusableButton>
                                    <ReusableButton
                                        name={'Close Maintenance'}
                                        onClick={() => toggleModal('close_maintenance')}
                                    >
                                        <CheckCheck size={12}/>
                                    </ReusableButton>
                                </div>
                            }
                            <hr className="bg-gray-100"/>

                            <MaintenanceHistory maintenance={data}/>

                        </MuiCardComponent>

                        <PopupModal
                            isOpen={isModalOpen}
                            onSaveButtonName={'Save'}
                            onClose={toggleModal}
                            isDisabled={false}
                            title={"Start Maintenance"}
                        >
                            <form onSubmit={(event) => handleSubmit('manipulate-maintenance', event)}>
                                <MuiDate
                                    handleDateChange={handleInputChange}
                                    from={'maintenance_date'}
                                    label={"Maintenance Date"}
                                    value={maintenance_date  ? maintenance_date : dayjs().format()}
                                    // value={maintenance_date }
                                    // minDate={item.minDate}
                                    // maxDate={item.maxDate}
                                    defaultValue={dayjs().format()}
                                    isDisabled={false}
                                />
                                <TextArea
                                    placeholder={"Notes"}
                                    from={"notes"}
                                    label={"Notes"}
                                    value={notes}
                                    onChange={handleInputChange}
                                />

                                <div className={'flex gap-2 justify-end'}>
                                    <ReusableButton
                                        name={'Submit'}
                                        type='submit'
                                    />
                                </div>
                            </form>
                        </PopupModal>
                    </>
            }
        </ProtectedRoute>
    );
};

export default MaintenanceView;