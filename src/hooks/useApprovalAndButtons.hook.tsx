"use client"

import {getValueFromLocalStorage, setValueLocalStorage} from '@/utils/actions/local-starage';
import {get, post} from '@/utils/api';
import React, {ReactNode, useEffect, useState} from 'react';
import {ReusableButton} from "@/components/button/reusable-button";
import CrudFormComponent from "@/components/forms/crud.form.component";
import {capitalizeFirstWord} from "@/utils/actions/string-manipulations";
import Swal from "sweetalert2";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";

interface Props {
    approval_slug?: string;
    from: string;
    from_id: string;
    parent?: string;
}

export const useApprovalsAndButtonsHook = ({
                                               approval_slug,
                                               from,
                                               from_id,
                                               parent
                                           }: Props) => {
    const [isNeedApprove, setIsNeedApprove] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isMyLevelApproved, setIsMyLevelApproved] = useState(false);
    const [canApprove, setCanApprove] = useState(false);
    const [isLastLevel, setIsLastLevel] = useState(false);
    const [refresh, setIsrefresh] = useState(false);
    const [approveStatus, setApproveStatus] = useState('');
    const [latestApproveStatus, setLatestApproveStatus] = useState('');
    const {dispatch, state} = useGlobalContextHook()
    const viewedItem = state.viewedItem

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

    const getApprovedItemByLevelId = async (level_id: number) => {
        const response = await get('approval/approved-items');

        if (response.status === 200) {
            return response.data.data?.find(
                (item: any) =>
                    Number(item.approval_level_id) === Number(level_id) &&
                    item.from === from &&
                    Number(item.from_id) === Number(from_id)
            );
        }

        return [];
    }

    const approval_url = `approval/approved-items/by-item?from=${from}&&from_id=${from_id}`


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

            return {current_level, latestLevel, levels, previousLevel};

        }
        return {current_level: null, latestLevel: null, levels: [], previousLevel: null};
    };

    useEffect(() => {
        const fetchApprovalData = async () => {
            const {current_level, latestLevel, levels, previousLevel} = getApprovalLevel();
            const mappedApproval = getMappedApproval();

            if (mappedApproval && levels.length > 0) {
                setIsNeedApprove(true);
            }

            if (!parent || parent === viewedItem.from) {
                if (!current_level) return;
                try {
                    const approvedItemForCurrentLevel = await getApprovedItemByLevelId(current_level?.id);
                    if (approvedItemForCurrentLevel) {
                        setIsApproved(true);
                        setIsMyLevelApproved(true);
                        setApproveStatus(approvedItemForCurrentLevel.type);
                    }

                    if (previousLevel) {
                        const approvedItemForPreviousLevel = await getApprovedItemByLevelId(previousLevel?.id);
                        if (approvedItemForPreviousLevel?.type === "approve") {
                            setCanApprove(true);
                        }
                    } else {
                        setCanApprove(true);
                    }
                } catch (error) {
                    console.error("Error fetching approval status:", error);
                }
            }

            if (latestLevel) {
                try {


                    console.log('mappedApproval', mappedApproval)

                    const approvedItemForLatestLevel = await getApprovedItemByLevelId(latestLevel?.id);
                    if (approvedItemForLatestLevel) {
                        setIsLastLevel(true);
                    }
                } catch (error) {
                    console.error("Error fetching approved item for latest level:", error);
                }
            }

            const filteredItems = allApprovedItems.filter(
                (item) => item.from === from && Number(item.from_id) === Number(from_id)
            );

            if (filteredItems.length > 0) {
                const latestItem = filteredItems.reduce((max, item) => {
                    return Number(item.id) > Number(max.id) ? item : max;
                }, filteredItems[0]);

                if (latestItem) {
                    setLatestApproveStatus(latestItem.type);
                }
            }
        };

        fetchApprovalData();
        // }, [approval_slug]);
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
        const {current_level} = getApprovalLevel();

        if (current_level) {
            body = {...body, approval_level_id: current_level.id};
            const response = await post(approveUrl, body, token);
            if (response.status === 200) {
                setIsrefresh(!refresh); // Trigger a re-render by toggling the refresh state
                dispatch({type: "UPDATE_VIEW_ITEM_REFRESH_AFTER_APPROVAL"})
            }

            return response;
        }
        return null;
    };

    const callBack = () => {
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

            let approvedItems = JSON.parse(getValueFromLocalStorage('approved_items')) || [];
            approvedItems.push(response.data.data);
            setValueLocalStorage('approved_items', JSON.stringify(approvedItems));

            await Swal.fire({
                title: `Project ${modalTitle}`,
                text: `Project ${modalTitle} successfully`,
                icon: "success"
            });
        }
    }

    interface ApprovalsAndButtonsProps {
        buttonBody?: ReactNode,
    }

    const approvalsAndButtonsWrapper = ({buttonBody}: ApprovalsAndButtonsProps) => {
        return (
            <>
                {isNeedApprove ? (
                    <>
                        {latestApproveStatus && isLastLevel ? (
                            <div className={'flex w-full justify-between items-center'}>
                                <p className={`text-xs p-1 mt-2`}>
                                    {latestApproveStatus === "approve" ? (
                                        <span className='bg-green-100 p-2 rounded-sm'>Approved</span>
                                    ) : (
                                        <span className='bg-red-100 p-2 rounded-sm'>Disapproved</span>
                                    )}
                                </p>
                                {buttonBody}
                            </div>
                        ) : (
                            <>
                                {canApprove && !isMyLevelApproved ? (
                                    <div className='flex gap-2'>
                                        <ReusableButton
                                            name='Approve'
                                            onClick={() => handleApproval('approve')}
                                            rounded={'md'}
                                            padding={'p-3'}
                                            shadow={'shadow-md'}
                                            bg_color={'bg-gray-50'}
                                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                                            border={'border border-gray-300'}
                                            text_color={'text-gray-700'}
                                        />
                                        <ReusableButton
                                            name='DisApprove'
                                            onClick={() => handleApproval('disapprove')}
                                            rounded={'md'}
                                            padding={'p-3'}
                                            shadow={'shadow-md'}
                                            bg_color={'bg-gray-50'}
                                            hover={'hover:bg-gray-200 hover:border-gray-400'}
                                            hover_text={'hover:text-gray-900 hover:font-semibold'}
                                            border={'border border-gray-300'}
                                            text_color={'text-gray-700'}
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
                                ) : <>
                                    <p className='text-xs p-1 bg-gray-200'>Waiting For Approval</p>
                                </>
                                }
                            </>
                        )}
                        <div className={'flex justify-between ml-2 w-36'}>
                            <SlideOver
                                showButton={isNeedApprove}
                                title="Approval Trail">
                                <TreeList
                                    url={approval_url}
                                />
                            </SlideOver>
                        </div>
                    </>
                ) : buttonBody
                }
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
        latestApproveStatus,
        approvalsAndButtonsWrapper,
        refresh
    };
};
