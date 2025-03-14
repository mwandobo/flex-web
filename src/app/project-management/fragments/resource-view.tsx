"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";

const ResourceView = (id: string) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const url = `resource/${id}`
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
                                        { label: 'Resource Type', value: data?.resource_type_name },
                                        { label: 'Resource Name', value: data?.resource_name },
                                        { label: 'Quantity', value: data?.quantity },
                                        { label: 'Amount', value: data?.amount },
                                        { label: 'Requested Date', value: data?.formatted_requested_date },
                                        { label: 'Dispatched Date', value: data?.formatted_dispatched_date },
                                        { label: 'Status', value: data?.status },
                                        { label: 'Description', value: data?.details },
                                    ]}
                                    titleA={`Resource`}
                                    titleB={` ${data?.resource_name} `}
                                />
                            </div>

                    </>
            }
        </ProtectedRoute>
    );
};

export default ResourceView;