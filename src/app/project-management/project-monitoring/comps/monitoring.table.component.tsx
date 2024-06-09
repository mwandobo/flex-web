"use client"

import MuiTable from "@/components/tables/mui-table"

interface Props {
    data: any[]
}

const Columns = [
    {
        id: 'Code',
        numeric: false,
        disablePadding: false,
        label: 'Code',
        width: '5%'
    },
    {
        id: 'Name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
        wiidth: "45%"
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        wiidth: "10%"
    },
    {
        id: 'Progress',
        numeric: false,
        disablePadding: false,
        label: 'Progress',
        width: '40%'
    },
]

export const MonitoringTableComponent = ({ data }: Props) => {
    return (
        <div className="px-1" >
            <MuiTable
                data={data}
                columns={Columns}
            />
        </div>
    )
}