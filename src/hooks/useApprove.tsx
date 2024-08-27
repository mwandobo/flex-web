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

    const foundSysApproval = allSysApprovals?.find((item: any) => item.name === approval_slug)
    if (foundSysApproval) {
        const mappedApproval = allRegisteredApprovals?.find((item: any) => Number(item.sys_approval_id) === Number(foundSysApproval?.id))
        if (mappedApproval) {
            const levels = mappedApproval?.approval_levels

            console.log(levels)

            const found_level = levels?.find((item: any) => Number(item.role_id) === Number(role?.id))
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

    const updateApprovalLevel = () => {

    }

    return { isApproved, canApprove, isNeedApprove }
};