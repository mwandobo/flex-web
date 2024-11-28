"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { StatusCreatorHelperActive } from "@/utils/statusHelper/active";
import { useEffect, useState } from "react";
import Employees from "../../employees/page";
import { useRouter } from "next/navigation";

const PositionView = ({ params }: { params: { positionId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)

    const token = getValueFromLocalStorage('token')
    const departmentId = getValueFromLocalStorage('parent_id')
    const id = params.positionId

    const url = `position/${id}`
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
    }, [])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            links={[
                                { name: 'Position', linkTo: '/admnistration/positions', permission: 'positions', isClickable: true },
                                { name: 'Show', linkTo: '', permission: '' },]}
                            isShowPage={true}
                        />

                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Position Name', value: data?.name },
                                        { label: 'Department', value: data?.department },
                                    ]}
                                    titleA={`Position`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                            <div className="mt-3 px-3">
                                <div className="border border-solid border-gray-200 p-2">
                                    <Employees
                                        parent_id={id}
                                        subHeader={`All Employees in ${data.name} Position`}
                                    />
                                </div>
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default PositionView;