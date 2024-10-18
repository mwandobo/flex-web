import CrudButtonsComponent from "@/components/crud-operator-buttons"
import FormattedMoney from "@/components/moneyFormater"
import ProgressStatus from "@/components/status/progress"
import MuiTable from "@/components/tables/mui-table"
import {getApprovals} from "@/utils/approve/approvalHelper";

interface Props {
    columns: any[]
    data: any[]
    handleClick: (typr: string, payload: any) => void
    show_assign?: boolean
    permission?: string;
    isHideShow?: boolean;
    isHideDelete?: boolean;
    isHideEdit?: boolean;
    isHideActions?: boolean;
    isShowAddPriceButton?: boolean;
    from?: string;
    approval_slug?: string;
}

export const usePopulateTable = ({
                                     columns,
                                     data,
                                     handleClick,
                                     show_assign,
                                     permission,
                                     isHideShow,
                                     isHideDelete,
                                     isHideEdit,
                                     isHideActions,
                                     isShowAddPriceButton,
                                     approval_slug,
                                     from
                                 }: Props) => {
    const createRowHeader = () => {
        let newColumns: any[] = []

        columns.forEach(column => {
            if (!column.isHidden) {
                newColumns = [...newColumns, column]
            }
        })

        return isHideActions ? newColumns : [
            ...newColumns,
            {
                id: 'actions',
                numeric: false,
                disablePadding: false,
                label: 'Actions',
                width: '5%',
            },
        ]
    }

    const createRowHeaderArray = () => {
        let newColumns: any[] = []

        createRowHeader().forEach(column => {
            if (!column.isHidden) {
                newColumns = [...newColumns, column.id]
            }
        })

        return newColumns
    }

    function sortObjectValuesByHeaders(obj: any, headers: any[]) {
        return headers.map(header => obj[header]);
    }

    const createRowData = () => {
        let newData: any = []

        if (data && data.length > 0) {
            newData = data.map(obj => {
                const {
                    isAnyLevelApproved,
                    latestApproveStatus,
                    isNeedApprove
                } = getApprovals(approval_slug, approval_slug, obj?.id)
                if (obj.has_url) {
                    obj = {
                        ...obj,
                        file: <p className="mb-1"><a href={obj.location}
                                                     className="text-blue-600 border-b border-gray-300">{obj.name}</a>
                        </p>
                    }
                }

                if (obj.has_progress_status_task) {
                    obj = {...obj, progress_status: <ProgressStatus status={obj.progress_status}/>}
                }

                if (obj.cost) {
                    obj = {...obj, cost: <FormattedMoney amount={obj.cost}/>}
                }

                if (obj.resource_cost) {
                    obj = {...obj, resource_cost: <FormattedMoney amount={obj.resource_cost}/>}
                }

                if (obj.total_cost) {
                    obj = {...obj, total_cost: <FormattedMoney amount={obj.total_cost}/>}
                }

                if (obj.total_direct_cost) {
                    obj = {...obj, total_direct_cost: <FormattedMoney amount={obj.total_direct_cost}/>}
                }

                if (obj.total_resource_cost) {
                    obj = {...obj, total_resource_cost: <FormattedMoney amount={obj.total_resource_cost}/>}
                }

                if (obj.grand_total_cost) {
                    obj = {...obj, grand_total_cost: <FormattedMoney amount={obj.grand_total_cost}/>}
                }

                if (obj.paid_amount || obj.paid_amount === 0) {
                    obj = {...obj, paid_amount: <FormattedMoney amount={obj.paid_amount} isHideCurrency={true}/>}
                }

                if (obj.delivery_cost || obj.delivery_cost === 0) {
                    obj = {...obj, delivery_cost: <FormattedMoney amount={obj.delivery_cost} isHideCurrency={true}/>}
                }

                if (obj.amount) {
                    obj = {...obj, amount: <FormattedMoney amount={obj.amount} isHideCurrency={true}/>}
                }

                if (obj.remaining_amount) {
                    obj = {
                        ...obj,
                        remaining_amount: <FormattedMoney amount={obj.remaining_amount} isHideCurrency={true}/>
                    }
                }

                const hideButton = () => {
                    let hide = false

                    if (isNeedApprove && isAnyLevelApproved && latestApproveStatus === 'approve') {
                        hide = true;
                    }

                    if (obj?.status === 'pending') {
                        hide = false;
                    }

                    if (!obj?.status) {
                        hide = false;
                    }

                    return hide
                }

                obj.actions = <CrudButtonsComponent
                    hide_approve={true}
                    handleClick={handleClick}
                    input={obj}
                    show_assign={show_assign}
                    isShowAddPriceButton={isShowAddPriceButton}
                    permission={permission}
                    hide_view={isHideShow}
                    hide_edit={isHideEdit || hideButton()}
                    hide_delete={isHideDelete || hideButton()}
                />

                return sortObjectValuesByHeaders(obj, createRowHeaderArray())
            })
        }
        return newData
    }

    const tabular = () => {
        return (
            <div className="w-96" style={{width: '100%'}}>
                <MuiTable
                    data={createRowData()}
                    columns={createRowHeader()}
                />
            </div>
        )
    }

    return {
        tabular
    }
}