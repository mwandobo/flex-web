"use client"

import MuiTable from "@/components/tables/mui-table"

interface Props {
    data: any[]
}

const Columns = [
    {
        id: '',
        numeric: false,
        disablePadding: false,
        label: 'Name',
        width: '25%',

    },
    {
        id: 'Access',
        numeric: false,
        disablePadding: false,
        label: 'Access',
    },
]

export const PermTableComponent = ({ data }: Props) => {


    const createdRowData = (perm: any) => {
        const row = [
            perm?.group,
            perm.permissions.map((perm: any) => perm.name + ', ')

        ]
        return row
    }

    const customFunction = () => {
        let payload: any[] = []

        data.forEach((perm_group: any) => {
            const row = createdRowData(perm_group)
            payload.push(row)
        })

        return payload
    }

    return (
        <div className="w-96" style={{ width: '100%' }}>
            {
                data && data.length > 0 ?
                    <MuiTable
                        columns={Columns}
                        data={customFunction()}
                    /> :
                    <p>No Permissions Assigned yet</p>
            }

        </div>
    )
}