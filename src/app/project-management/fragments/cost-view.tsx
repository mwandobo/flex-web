"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";

const CostView = (id: string) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const url = `cost/${id}`
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
                                        { label: 'Cost Name', value: data?.name },
                                        { label: 'Purpose', value: data?.purpose },
                                        { label: 'Amount', value: data?.formatted_amount },
                                        { label: 'Dispatched Amount', value: data?.dispatched_amount },
                                        { label: 'Expense', value: data?.occured_cost },
                                        { label: 'Requested Date', value: data?.formatted_requested_date },
                                        { label: 'Submitted Date', value: data?.formatted_submitted_date },
                                        { label: 'Dispatched Date', value: data?.formatted_dispatched_date },
                                        { label: 'Status', value: data?.status },
                                    ]}
                                    titleA={`Cost`}
                                    titleB={` ${data?.name} `}
                                />
                            </div>

                    </>
            }
        </ProtectedRoute>
    );
};

export default CostView;