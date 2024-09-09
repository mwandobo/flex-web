import {getValueFromLocalStorage, setValueLocalStorage} from '@/utils/actions/local-starage';
import { post } from '@/utils/api';
import { useState, useEffect } from 'react';
import {ReusableButton} from "@/components/button/reusable-button";
import CrudFormComponent from "@/components/forms/crud.form.component";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";
import Swal from "sweetalert2";

interface Props {
    approval_slug?: string;
    from: string;
    from_id: string;
}

export const useApprovalHook = ({
    approval_slug,
    from,
    from_id
}: Props) => {
    const [isNeedApprove, setIsNeedApprove] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isMyLevelApproved, setIsMyLevelApproved] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [isLastLevel, setIsLastLevel] = useState(false);
    const [refresh, setIsrefresh] = useState(false);
    const [approveStatus, setApproveStatus] = useState('');

    const allSysApprovals = JSON.parse(getValueFromLocalStorage('sys_approvals'));
    const allRegisteredApprovals = JSON.parse(getValueFromLocalStorage('approvals'));
    const allApprovedItems = JSON.parse(getValueFromLocalStorage('approved_items'));
    const role = JSON.parse(getValueFromLocalStorage('role'));
    const token = getValueFromLocalStorage('token');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [remark, setRemark] = useState('');


    const getMappedApproval = () => {
        const foundSysApproval = allSysApprovals?.find((item: any) => item.name === approval_slug);
        if (foundSysApproval) {
            return allRegisteredApprovals?.find((item: any) => Number(item.sys_approval_id) === Number(foundSysApproval?.id));
        }
        return null;
    };

    const getApprovedItemByLevelId = (level_id: number) => {
        const approvedItem = allApprovedItems?.find(
            (item: any) =>
                Number(item.approval_level_id) === Number(level_id) &&
                item.from === from &&
                item.from_id === from_id
        );

        return approvedItem;
    }


    const getApprovalLevel = () => {
        const mappedApproval = getMappedApproval();
        if (mappedApproval) {
            const levels = mappedApproval?.approval_levels || [];
            const current_level = levels?.find((item: any) => Number(item.role_id) === Number(role?.id));
            const latestLevel = levels?.reduce((max, item) => {
                return Number(item.id) > Number(max.id) ? item : max;
            }, levels[0]);
            const previousLevel = levels?.reduce((prev, item) => {
                if (Number(item.id) < Number(current_level?.id)) {
                    return !prev || Number(item.id) > Number(prev.id) ? item : prev;
                }
                return prev;
            }, null);

            return { current_level, latestLevel, levels, previousLevel };
        }
        return { current_level: null, latestLevel: null, levels: [], previousLevel: null };
    };

    useEffect(() => {
        const { current_level, latestLevel, levels, previousLevel } = getApprovalLevel();
        // console.log('previousLevel', previousLevel)
        // console.log('levels', levels)
        // console.log('latestLevel', latestLevel)
        // console.log('current_level', current_level)
        // console.log('role', role)
        const mappedApproval = getMappedApproval();

        if (mappedApproval && levels.length > 0) {
            setIsNeedApprove(true);
        }

        if (current_level) {
            const approvedItemForCurrentLevel = getApprovedItemByLevelId(current_level?.id)
            if (approvedItemForCurrentLevel && approvedItemForCurrentLevel.type === "approve") {
                setIsApproved(true)
                setIsMyLevelApproved(true);
                setApproveStatus(approvedItemForCurrentLevel.type);

            } else {
                if (previousLevel) {
                    const approvedItemForPreviousLevel = getApprovedItemByLevelId(previousLevel?.id)
                    if (approvedItemForPreviousLevel && approvedItemForPreviousLevel.type === "approve") {
                        setCanApprove(true)
                    }
                } else {
                    setCanApprove(true)
                }
            }
        }

        if (latestLevel) {
            const approvedItemForLatestLevel = getApprovedItemByLevelId(latestLevel?.id)
            if (approvedItemForLatestLevel) {
                setIsLastLevel(true);
            }
        }

    }, [approval_slug, role, isApproved, refresh, getApprovalLevel, getMappedApproval, getApprovedItemByLevelId]);



    interface ApproveProps {
        approval_name?: string;
        from: string;
        from_id: string;
        remark?: string;
        approval_level_id?: string;
        type?: string;
    }

    const approve = async (body: ApproveProps) => {
        const approveUrl = 'approval/approve';
        const { current_level } = getApprovalLevel();

        if (current_level) {
            body = { ...body, approval_level_id: current_level.id };
            const response = await post(approveUrl, body, token);
            if (response.status === 200) {
                setIsrefresh(!refresh); // Trigger a re-render by toggling the refresh state
            }

            return response;
        }
        return null;
    };


    const callBack = () => {

        // console.log('call back called')
        // console.log('isApproved', isApproved)
        // console.log('isLastLeve', isLastLevel)

        // console.log("isApproved", isApproved)
        // console.log('canApprove', canApprove)
        // console.log('isMyLevelApproved', isMyLevelApproved)

        setIsrefresh(prev => !prev); // Trigger a re-render by toggling the refresh state

        return null;
    };

    const handleApproval = (type: string) => {
        setModalTitle(type);
        setIsModalOpen(true);
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleInputChange = (e: any) => {
        setRemark(e?.target?.value);
    }

    const handleSubmit = async () => {
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
            callBack();

            // Refetch data after successful approval
            // refreshData();

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

    const approvalButtonsWrapper = ()=>{
        return (
            <>
                {isNeedApprove && (
                    <>
                        {isApproved && isLastLevel ? (
                            <p className='text-xs p-1'>
                                {approveStatus === "approve" ? (
                                    <span className='bg-green-100'>Approved</span>
                                ) : (
                                    <span className='bg-red-100'>Disapproved</span>
                                )}
                            </p>
                        ) : (
                            <>
                                {canApprove && !isMyLevelApproved ? (
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
                )}
            </>
        );
    }




    return {
        isApproved,
        canApprove,
        isNeedApprove,
        approve,
        callBack,
        isLastLevel,
        approveStatus,
        isMyLevelApproved,
        approvalButtonsWrapper
    };
};
