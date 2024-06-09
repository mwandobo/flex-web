"use client"


import MuiTable from "@/components/tables/mui-table"

interface Props {
    data: any[]
}

const Columns = [
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Code',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'Direct Cost',
        numeric: false,
        disablePadding: false,
        label: 'Direct Cost',
    },
    {
        id: 'Resource Cost',
        numeric: false,
        disablePadding: false,
        label: 'Resource Cost',
    },
    {
        id: 'Total Cost',
        numeric: false,
        disablePadding: false,
        label: 'Total Cost',
    },
    {
        id: 'progress_status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
]

export const TaskMonitoringTableComponent = ({ data }: Props) => {
    return (
        <div >
            <MuiTable
                data={data}
                columns={Columns}
            />
        </div>
    )
}