"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Profile = () => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const user = JSON.parse(getValueFromLocalStorage('user'))

    console.log('user', user)

    const url = `profile/${user?.id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

                try {
                    setLoading(true)
                    const res = await get(url)

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
        fetchData()
    }, [])


    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    { label: 'Name', value: data.full_name },
                                    { label: 'Phone', value: data?.phone },
                                    { label: 'Email', value: data?.email },
                                    { label: 'Department', value: data?.department },
                                    { label: 'Position', value: data?.position },
                                    { label: 'Role', value: data?.role },
                                    { label: 'Birth Date', value: data?.formatted_d_o_b },
                                ]}
                                titleA="User Profile"
                                titleB={data.full_name}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>

    );
};

export default Profile;