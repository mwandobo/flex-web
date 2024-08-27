import { getValueFromLocalStorage } from '@/utils/actions/local-starage';
interface Props {
    approval_slug?: string
}

export const useApprovalHook = ({ approval_slug }: Props) => {
    let isNeedApprove = false
    let isApproved = false
    let canApprove = false

    let allSysApprovals = getValueFromLocalStorage('sys_approvals')
    allSysApprovals = JSON.parse(allSysApprovals)
    let allRegisteredApprovals = getValueFromLocalStorage('approvals')
    allRegisteredApprovals = JSON.parse(allRegisteredApprovals)
    let allApprovedItems = getValueFromLocalStorage('approved_items')
    allApprovedItems = JSON.parse(allApprovedItems)
    let role = getValueFromLocalStorage('role')
    role = JSON.parse(role)


    const foundSysApproval = allSysApprovals?.find((item: any) => item.name === approval_slug)
    if (foundSysApproval) {
        const mappedApproval = allRegisteredApprovals?.find((item: any) => Number(item.sys_approval_id) === Number(foundSysApproval?.id))
        if (mappedApproval) {
            const levels = mappedApproval?.approval_levels
            console.log("levels", levels)
            console.log('role', role?.id)

            const found_level = levels?.find((item: any) => Number(item.role_id) === Number(role?.id))
            console.log(found_level)
            if (found_level) {
                isNeedApprove = true
                canApprove = true
                const approvedItem = allApprovedItems.find((item: any) => Number(item.approval_level_id) === Number(found_level?.id))
                if (approvedItem) {
                    isApproved = true
                } else {
                    isApproved = false
                }
            }
        }
    }

    const updateApprovalLevel = (approvalLevel: any) => {
        // Find the mapped approval based on the provided approval ID
        const mappedApproval = allRegisteredApprovals?.find(
            (item: any) => Number(item.sys_approval_id) === Number(approvalLevel?.approval_id)
        );

        if (mappedApproval) {
            const levels = mappedApproval?.approval_levels || [];

            // Find the level in the existing approval levels
            const foundLevelIndex = levels.findIndex(
                (item: any) => Number(item.id) === Number(approvalLevel?.id)
            );

            if (foundLevelIndex !== -1) {
                if (approvalLevel.delete) {
                    // If the approvalLevel has a 'delete' flag, remove the level
                    levels.splice(foundLevelIndex, 1);
                } else {
                    // If found, update the existing level
                    levels[foundLevelIndex] = { ...levels[foundLevelIndex], ...approvalLevel };
                }
            } else {
                if (!approvalLevel.delete) {
                    // If not found and not marked for deletion, add as a new level
                    levels.push(approvalLevel);
                }
            }

            // Update the approval levels in the mapped approval
            mappedApproval.approval_levels = levels;
        }
    };


    return { isApproved, canApprove, isNeedApprove }
};