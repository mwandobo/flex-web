"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AssumptionView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const token = getValueFromLocalStorage('token')

    const url = `department/show/1`
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
                                />
                            </div>

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default AssumptionView;