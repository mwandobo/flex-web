"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";

const IndicatorView = (id: string) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const url = `indicator/${id}`
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
                                        { label: 'Indicator Code', value: data?.formatted_code },
                                        { label: 'Indicator Name', value: data?.name },
                                        { label: 'Baseline Data', value: data?.baseline_data },
                                        { label: 'Target Data', value: data?.target_data },
                                        { label: 'Collected Data', value: data?.collected_data },
                                        { label: 'Collection Method', value: data?.collection_method },
                                        { label: 'Frequency and Schedule', value: data?.frequency },
                                        { label: 'Responsibilities', value: data?.responsibilities },
                                        { label: 'Information Use / Audience', value: data?.audience },
                                        { label: 'Description', value: data?.description },
                                    ]}
                                    titleA={`Indicator`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>

                    </>
            }
        </ProtectedRoute>
    );
};

export default IndicatorView;