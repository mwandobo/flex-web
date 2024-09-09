import {getValueFromLocalStorage} from '@/utils/actions/local-starage';

interface Props {
    approval_slug?: string;
    from: string;
    from_id: string;
}

const allSysApprovals = JSON.parse(getValueFromLocalStorage('sys_approvals'));
const allRegisteredApprovals = JSON.parse(getValueFromLocalStorage('approvals'));
const allApprovedItems = JSON.parse(getValueFromLocalStorage('approved_items'));
const role = JSON.parse(getValueFromLocalStorage('role'));


const getMappedApproval = (approval_slug: string) => {
    const foundSysApproval = allSysApprovals?.find((item: any) => item.name === approval_slug);
    if (foundSysApproval) {
        return allRegisteredApprovals?.find((item: any) => Number(item.sys_approval_id) === Number(foundSysApproval?.id));
    }
    return null;
};

const getApprovedItemByLevelId = (level_id: number, from: string, from_id: string) => {
    const approvedItem = allApprovedItems?.find(
        (item: any) =>
            Number(item.approval_level_id) === Number(level_id) &&
            item.from === from &&
            Number(item.from_id) === Number(from_id)
    );

    return approvedItem;
}


const getMultipleApprovedItemByLevelId = (level_ids: number[], from: string, from_id: string) => {
    const approvedItems = allApprovedItems?.filter((item: any) =>
        level_ids.includes(Number(item.approval_level_id)) &&
        item.from === from &&
        Number(item.from_id) === Number(from_id)
    );

    return approvedItems;
}

const getApprovalLevel = (approval_slug: string) => {
    const mappedApproval = getMappedApproval(approval_slug);
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

export const getApprovals = (approval_slug: string, from: string, from_id: string) => {
    const {current_level, latestLevel, levels, previousLevel} = getApprovalLevel(approval_slug);
    let canApprove = false
    let isApproved = false
    let isMyLevelApproved = false
    let approveStatus = ''
    let isLastLevel = false
    let isAnyLevelApproved = false

    const mappedApproval = getMappedApproval(approval_slug);

    if (mappedApproval && levels.length > 0) {
        canApprove = true
    }

    if(levels.length > 0) {
        const level_ids = levels.map((level: any) => level.id);
        const approvedItemForLevels = getMultipleApprovedItemByLevelId(level_ids, from, from_id)

        if(approvedItemForLevels.length > 0){
            isAnyLevelApproved = true;
        }
    }

    if (current_level) {
        const approvedItemForCurrentLevel = getApprovedItemByLevelId(current_level?.id, from, from_id)

        console.log("approvedItemForCurrentLevel", approvedItemForCurrentLevel)
        if (approvedItemForCurrentLevel ) {
            isApproved = true
            isMyLevelApproved = true
            approveStatus = approvedItemForCurrentLevel.type

        } else {
            if (previousLevel) {
                const approvedItemForPreviousLevel = getApprovedItemByLevelId(previousLevel?.id, from, from_id)
                if (approvedItemForPreviousLevel && approvedItemForPreviousLevel.type === "approve") {
                    canApprove = true
                }
            } else {
                canApprove = true
            }
        }
    }

    if (latestLevel) {
        const approvedItemForLatestLevel = getApprovedItemByLevelId(latestLevel?.id, from, from_id)
        if (approvedItemForLatestLevel) {
            isLastLevel = true
        }
    }

    return {
        current_level,
        latestLevel,
        isApproved,
        canApprove,
        isMyLevelApproved,
        approveStatus,
        isLastLevel,
        isAnyLevelApproved
    }
};




