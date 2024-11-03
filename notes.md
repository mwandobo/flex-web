remove comment in the sidebar for logo
in the layout change color from yellow to gray
in the side bar change color from yellow to white.
in the headers change color from yellow to white.
after change password check the redirect page.

when fetch approval update state.

after change password redirect.
check if it needs approve in the index page.
if itNeeds approve fetch approvedItems on that page refresh
####CASEREQUISITIONREQUEST
i have to create a condition in the crud form which will also allow to pass form instead of form inputs
I handle form state isolated store in local storage and the pull while submitting

i have to contorl modal body ealy before i get deep

Card still clickable when i created purchase request

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



&& progressRender(item.progress) !== "No Indicator" 