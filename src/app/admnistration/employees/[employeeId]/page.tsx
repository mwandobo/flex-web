"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { dateFormatterHelper } from "@/utils/mapper/date-format";
import { StatusCreatorHelperActive } from "@/utils/statusHelper/active";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import {EMPLOYEE_APPROVAL_SLUG, PRICING_APPROVAL_SLUG} from "@/utils/constant";

const EmployeeShow = ({ params }: { params: { employeeId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')

    const id = params.employeeId

    const url = `employee/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: EMPLOYEE_APPROVAL_SLUG,
        from: EMPLOYEE_APPROVAL_SLUG,
        from_id: id
    })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (id) {
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
            }
        };
        fetchData()
    }, [])


    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                { name: 'Employee', linkTo: '/admnistration/employees', permission: 'employees', isClickable: true },
                                { name: 'Show', linkTo: '/admnistration/employees/show', permission: '' },]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    { label: 'Employee Name', value: data.full_name },
                                    { label: 'Phone', value: data?.phone },
                                    { label: 'Email', value: data?.email },
                                    { label: 'Department', value: data?.department },
                                    { label: 'Position', value: data?.position },
                                    { label: 'Role', value: data?.role },
                                    { label: 'Birth Date', value: data?.formatted_d_o_b },
                                    // { label: 'Status', value: StatusCreatorHelperActive(passedData?.status) },

                                ]}
                                titleA="Employee"
                                titleB={data.full_name}
                                OptionalElement={approvalsAndButtonsWrapper({})}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>

    );
};

export default EmployeeShow;