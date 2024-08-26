"use client"

import { ReusableButton } from '../button/reusable-button';

interface Props {
    // children: React.ReactNode
    // permission?: string
}

const handleApproval = (type: string) => {
    switch (type) {
        case 'approve':
            console.log("approved");
            break;
        case 'disapprove':
            console.log("disapprove");
            break;
    }
}
const ApprovalWrapper = ({

}: Props) => {
    return <>
        <div className='flex gap-2'>
            <ReusableButton
                name='Approve'
                onClick={() => handleApproval('approve')}
            />
            <ReusableButton
                name='Dis Approve'
                onClick={() => handleApproval('disapprove')}
            />
        </div>
    </>
};

export default ApprovalWrapper;