
PROCESS FOR APPROVAL.

In the index page add approval slug .
in view page you have to use the following hook

/**
const {
isNeedApprove,
isLastLevel,
latestApproveStatus,
approvalButtonsWrapper,
} = useApprovalHook({
approval_slug: PROJECT_APPROVAL_SLUG,
from: 'project',
from_id: id
})
**/


Handle render when error

Approval  .. edit and delete refactor