"use client"

import { useApprovalHook } from '@/hooks/useApprove';
import { ReusableButton } from '../button/reusable-button';
import CrudFormComponent from '../forms/crud.form.component';
import { useState } from 'react';
import { useCrudFormCreator } from '@/hooks/crud/form-creator';
import { capitalizeFirstWord } from '@/utils/actions/string-manipulations';
import Swal from 'sweetalert2';

interface Props {
    approval_name?: string | undefined,
    from: string,
    from_id: string,
    remark?: string,
    type?: string,
    approval_level_id?: number
}

const ApprovalWrapper = (body: Props) => {
    const { approval_name } = body
    const { approve } = useApprovalHook({ approval_slug: approval_name })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [remark, setRemark] = useState('')

    const onCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleApproval = (type: string) => {
        setModalTitle(type)
        setIsModalOpen(true)
    }

    const handleInputChange = (e: any, from?: any) => {
        setRemark(e?.target?.value)
    }


    const handleSubmit = async () => {
        const { from, from_id } = body
        const payload = {
            from,
            from_id,
            remark,
            type: modalTitle
        }


        const response = await approve(payload)

        console.log(response)

        if (response.status === 200) {
            setIsModalOpen(false)
            Swal.fire({
                title: "Project Approval",
                text: "Project Approved successfully",
                icon: "success"
            })

        }


    }

    // // const { createdForm } = useCrudFormCreator(
    //     {
    //         isModalOpen,
    //         onCloseModal,
    //         onSaveButtonName: "Proceed",
    //         modalTitle: `${capitalizeFirstWord(modalTitle)}`,
    //         isForm: true,
    //         modalBodyArray: [
    //             {
    //                 name: 'description',
    //                 type: 'textArea',
    //                 label: 'Description',
    //                 value: '',
    //                 required: true,
    //                 isError: false,
    //                 errorMessage: ''
    //             },
    //         ],
    //         state_properties: [],
    //         url: 'approval/approve',
    //         httpMethod: 'post',
    //         from: "approval"

    //     }
    // )

    return <>
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
                    }]}
                modalTitle={capitalizeFirstWord(modalTitle)}
                isForm={true}
                handleInputChange={handleInputChange}
                onSaveButtonName={'Proceed'}
            />
            {/* {createdForm()} */}
        </div>
    </>
};

export default ApprovalWrapper;