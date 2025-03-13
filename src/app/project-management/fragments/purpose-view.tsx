"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import { get } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ViewCardItemApartComponent from "@/components/card/view.card-item-apart.component";

const AssumptionView = (id: string) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const url = `project_purpose/${id}`
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
                                        { label: 'Strategic Plan Element', value: data?.element },
                                        { label: 'Project Business Objective', value: data?.objective },
                                    ]}
                                    titleA={``}
                                    titleB={``}
                                />
                            </div>

                    </>
            }
        </ProtectedRoute>
    );
};

export default AssumptionView;