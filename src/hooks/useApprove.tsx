import { getValueFromLocalStorage } from '@/utils/actions/local-starage';

interface Props {
    approval_slug?: string
}

export const useApprovalHook = ({ approval_slug }: Props) => {
    let isNeedApprove = false
    let isApproved = null
    let canApprove = null

    const allRegisteredApprovals = getValueFromLocalStorage('approvals')
    const role = getValueFromLocalStorage('role')
    const allSysApprovals = getValueFromLocalStorage('sys_approvals')
    const allApprovedItems = getValueFromLocalStorage('approved_items')

    const foundSysApproval = allSysApprovals.find((item: any) => item.slug === approval_slug)
    if (foundSysApproval) {

        const mappedApproval = allRegisteredApprovals.find((item: any) => item.id === foundSysApproval)
        if (mappedApproval) {
            isNeedApprove = true
            const levels = mappedApproval.levels
            const found_level = levels.find((item: any) => Number(item.role_id) === Number(role?.id))
            if (found_level) {
                canApprove = true
                const approvedItem = allApprovedItems.find((item: any) => Number(item.approval_level_id) === Number(found_level?.id))
                if (approvedItem) {
                    isApproved = true
                } else {
                    isApproved = false
                }
            } else {
                canApprove = false
                isNeedApprove = false
            }
        }
    }

    return { isApproved, canApprove, isNeedApprove }
};