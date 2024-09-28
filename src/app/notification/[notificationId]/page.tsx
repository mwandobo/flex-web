"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DepartmentShow = ({ params }: { params: { notificationId: string } }) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')
    const id = params.notificationId
    const url = `notification/${id}`
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
                                { name: 'Notification', linkTo: '/notification', permission: 'notification', isClickable: true },
                                { name: 'Show', linkTo: '', permission: '' }
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        { label: 'Text', value: data?.description },
                                    ]}
                                    titleA={`Notification`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>
                            <hr className="bg-gray-100" />
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default DepartmentShow;