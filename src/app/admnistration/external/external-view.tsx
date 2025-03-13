"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";

const ExternalUserView = (id: string) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const url = `project-external-users/${id}`
    const navigateToLogin = () => {
        return router.push('/login')
    }

    useEffect(() => {
        const fetchData = async () => {
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
        };
        if(id){
            fetchData()
        }
    }, [id])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                            <div className="mb-3 w-full ">
                                <ViewCardItemApartComponent
                                    data={[
                                        { label:  'Name', value: data?.name },
                                        { label:  'Type', value: data?.type },
                                        { label:  'Email', value: data?.email },
                                        { label:  'Phone', value: data?.phone },
                                        { label:  'Position', value: data?.position },
                                        { label:  'Sponsorship', value: data?.sponsorship },
                                        { label:  'Start Date', value: data?.formatted_start_date },
                                        { label:  'End Date', value: data?.formatted_end_date },
                                    ]}
                                    titleA={``}
                                    titleB={` ${data?.name} `}
                                />
                            </div>

                    </>
            }
        </ProtectedRoute>
    );
};

export default ExternalUserView;