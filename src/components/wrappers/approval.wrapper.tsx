
interface Props {
    from: string,
    from_id: string,
    remark?: string,
    approveStatus?: string,
    approval_level_id?: number
    isApproved?: boolean
    isLastApproval?: boolean
    isNeedApproval?: boolean
    canApprove?: boolean
    isMyLevelApproved?: boolean
    refreshData: () => void; // Add the refreshData callback
}

const ApprovalWrapper = (body: Props) => {
    const {isNeedApproval,isLastApproval,isApproved, approveStatus, isMyLevelApproved, canApprove  } = body

    return (
        <>
            {isNeedApproval && (
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
                            {canApprove && !isMyLevelApproved ? (
                                // <div className='flex gap-2'>
                                //     <ReusableButton
                                //         name='Approve'
                                //         onClick={() => handleApproval('approve')}
                                //     />
                                //     <ReusableButton
                                //         name='DisApprove'
                                //         onClick={() => handleApproval('disapprove')}
                                //     />
                                //     <CrudFormComponent
                                //         isModalOpen={isModalOpen}
                                //         onCloseModal={onCloseModal}
                                //         handleSubmit={handleSubmit}
                                //         formInputs={[
                                //             {
                                //                 name: 'remark',
                                //                 type: 'textArea',
                                //                 label: 'Remark',
                                //                 value: remark,
                                //                 required: true,
                                //                 isError: false,
                                //                 errorMessage: ''
                                //             }
                                //         ]}
                                //         modalTitle={capitalizeFirstWord(modalTitle)}
                                //         isForm={true}
                                //         handleInputChange={handleInputChange}
                                //         onSaveButtonName={'Proceed'}
                                //     />
                                // </div>
                                <></>
                            ) : (
                                <p className='text-xs p-1 bg-gray-200'>Waiting For Approval</p>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ApprovalWrapper;
