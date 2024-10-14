import {getValueFromLocalStorage, setValueLocalStorage} from "./local-starage";
import {get} from "@/utils/api";

export const updateApprovals = async () => {
    const token = getValueFromLocalStorage('token');
    let approvals = await get('approval', token)

    approvals = approvals.data.data
    setValueLocalStorage('approvals', JSON.stringify(approvals))
};

export const updateApprovalItems = async () => {
    const token = getValueFromLocalStorage('token');
    let approvalItems = await get('approval/approved-items', token)
    approvalItems = approvalItems.data.data
    setValueLocalStorage('approved_items', JSON.stringify(approvalItems))
};

export const gracefulApprovalUpdater = async (from: string, approval_slug?: string) => {
    if( ['approvals', 'approval_levels'].includes(from) ){
        await updateApprovals()
    }
    if(approval_slug){
        await updateApprovalItems()
    }
};
