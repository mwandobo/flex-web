"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { StatusCreatorHelperActive } from "@/utils/statusHelper/active";
import { useEffect, useState } from "react";
import Positions from "../../positions/page";
import { useRouter } from "next/navigation";
import {useApprovalHook} from "@/hooks/useApprove";
import {DEPARTMENT_APPROVAL_SLUG, PRICING_APPROVAL_SLUG, PROJECT_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const DepartmentShow = ({ params }: { params: { departmentId: string } }) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const token = getValueFromLocalStorage('token')

    const id = params.departmentId
    const url = `department/show/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: DEPARTMENT_APPROVAL_SLUG,
        from: DEPARTMENT_APPROVAL_SLUG,
        from_id: id
    })

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
    }, [])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                { name: 'Department', linkTo: '/admnistration/departments', permission: 'departments', isClickable: true },
                                { name: 'Show', linkTo: '', permission: '' }
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Department Name', value: data?.name },
                                    ]}
                                    titleA={`Department`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({})}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-2">
                                    <Positions
                                        parent_id={id}
                                        subHeader={`All Positions in ${data.name} Department`}
                                    />
                                </div>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default DepartmentShow;