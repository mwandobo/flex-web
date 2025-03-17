"use client"
import ProtectedRoute from "@/components/authentication/protected-route";
import PageHeader from "@/components/header/page-header";
import { get, post } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getValueFromLocalStorage, } from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import MuiTable from "@/components/tables/mui-table";
import CrudButtonsComponent from "@/components/crud-operator-buttons";

const TimesheetShow = ({ params }: { params: { timesheetId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.timesheetId


    const url = `timesheet/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {

            try {
                setLoading(true)
                const res = await get(url, token)

                if (data && res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                if (error?.code === "ERR_NETWORK") {
                    navigateToLogin()
                }
            }
        };
        fetchData()
    }, [id, token])

    const columns = [
        {
            id: 'formatted_code',
            numeric: false,
            disablePadding: false,
            label: 'Code',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Activity Name',
        },
        {
            id: 'project',
            numeric: false,
            disablePadding: false,
            label: 'Project',
        },
        {
            id: 'formatted_start_date',
            numeric: false,
            disablePadding: false,
            label: 'Start Date',
        },
        {
            id: 'formatted_end_date',
            numeric: false,
            disablePadding: false,
            label: 'End Date',
        },
        {
            id: 'progress',
            numeric: false,
            has_progressStatus: true,
            disablePadding: false,
            label: 'Progress (%)',
        },
        {
            id: 'actions',
            numeric: false,
            has_progressStatus: true,
            disablePadding: false,
            label: 'Actions',
        },
    ]

    const handleClick = (type: string, payload?: any) => {
        if (type.toLowerCase() === 'show') {
            return router.push(`/project-management/timesheet-management/${id}/show/${payload.id}`)
        }
    }

    const createRow = (input: any,) => {
        let row: any;
        row = [
            input.formatted_code,
            input.name,
            input.project,
            input.formatted_start_date,
            input.formatted_end_date,
            input.progress ?? '0',
            <CrudButtonsComponent
                key={input.id + 'cr'}
                hide_approve={true}
                hide_edit={true}
                hide_delete={true}
                handleClick={handleClick}
                input={input}
            />
        ]

        return row
    }

    const customTableFunction = () => {
        let payload: any[] = []

        data.forEach((item: any) => {
            const row = createRow(item)
            payload.push(row)
        })

        return payload
    }

    console.log(data)

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col">
                        <PageHeader
                            links={[
                                { name: `Timesheet Management`, linkTo: '/project-management/timesheet-management', permission: '' },
                                { name: 'List', linkTo: '/projects/show', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <div className="bg-white ">
                            <h3>Activities List</h3>
                            <MuiTable
                                data={customTableFunction()}
                                columns={columns}
                            />
                        </div>

                    </div>
            }
        </ProtectedRoute>
    );
};

export default TimesheetShow;