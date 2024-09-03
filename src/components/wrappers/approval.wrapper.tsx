"use client"

import { useApprovalHook } from '@/hooks/useApprove';
import { ReusableButton } from '../button/reusable-button';
import CrudFormComponent from '../forms/crud.form.component';
import { useState } from 'react';
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations';
import Swal from 'sweetalert2';
import { getValueFromLocalStorage, setValueLocalStorage } from '@/utils/actions/local-starage';

interface Props {
    approval_name?: string | undefined,
    from: string,
    from_id: string,
    remark?: string,
    type?: string,
    approval_level_id?: number
    isApproved?: boolean
    isLastApproval?: boolean
    isNeedApproval?: boolean
}

const ApprovalWrapper = (body: Props) => {
    const { approval_name, from, from_id, isApproved, isLastApproval, isNeedApproval } = body;
    const {
        approve,
        canApprove,
        callBack,
        approveStatus,
    } = useApprovalHook({
        approval_slug: approval_name,
        from: from,
        from_id: from_id
    });



    // Add the `refresh` dependency to force re-rendering when the hook's state changes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [remark, setRemark] = useState('');

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleApproval = (type: string) => {
        setModalTitle(type);
        setIsModalOpen(true);
    }

    const handleInputChange = (e: any) => {
        setRemark(e?.target?.value);
    }

    const handleSubmit = async () => {
        const { from, from_id } = body;
        const payload = {
            from,
            from_id,
            remark,
            type: modalTitle
        };

        const response = await approve(payload);
        if (response && response.status === 200) {
            setIsModalOpen(false);
            setRemark('');
            callBack()
            let approvedItems = JSON.parse(getValueFromLocalStorage('approved_items')) || [];
            approvedItems.push(response.data.data);
            setValueLocalStorage('approved_items', JSON.stringify(approvedItems));

            Swal.fire({
                title: "Project Approval",
                text: "Project Approved successfully",
                icon: "success"
            });
        }
    }

    console.log(isNeedApproval)

    return (
        <>
            {isNeedApproval &&
                <>
                    {isApproved && isLastApproval ? (
                        <p className='text-xs p-1'>
                            {approveStatus === "approve" ? (
                                <span className='bg-green-100'>Approved</span>
                            ) : (
                                <span className='bg-red-100'>Disapproved</span>
                            )}
                        </p>
                    ) : (
                        <>
                            {canApprove ? (
                                <div className='flex gap-2'>
                                    <ReusableButton
                                        name='Approve'
                                        onClick={() => handleApproval('approve')}
                                    />
                                    <ReusableButton
                                        name='DisApprove'
                                        onClick={() => handleApproval('disapprove')}
                                    />
                                    <CrudFormComponent
                                        isModalOpen={isModalOpen}
                                        onCloseModal={onCloseModal}
                                        handleSubmit={handleSubmit}
                                        formInputs={[
                                            {
                                                name: 'remark',
                                                type: 'textArea',
                                                label: 'Remark',
                                                value: remark,
                                                required: true,
                                                isError: false,
                                                errorMessage: ''
                                            }
                                        ]}
                                        modalTitle={capitalizeFirstWord(modalTitle)}
                                        isForm={true}
                                        handleInputChange={handleInputChange}
                                        onSaveButtonName={'Proceed'}
                                    />
                                </div>
                            ) : (
                                <p className='text-xs p-1 bg-gray-200'>Waiting For Approval</p>
                            )}
                        </>
                    )}
                </>
            }
        </>);
};


export default ApprovalWrapper;