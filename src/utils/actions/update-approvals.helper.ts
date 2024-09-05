import {getValueFromLocalStorage, setValueLocalStorage} from "./local-starage";
import {get} from "@/utils/api";

export const updateApprovals = async () => {
    const token = getValueFromLocalStorage('token');
    let approvals = await get('approval', token)
    approvals = approvals.data.data
    setValueLocalStorage('approvals', JSON.stringify(approvals))
};

export const gracefulApprovalUpdater = async (from: string) => {
    if( ['approvals', 'approval_levels'].includes(from) ){
        await updateApprovals()
    }
};
