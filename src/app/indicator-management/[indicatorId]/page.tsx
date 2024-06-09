"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CollectedDataShow = ({ params }: { params: { indicatorId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')
    const id = params.indicatorId

    const url = `collected_data/show/${id}`
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
                                { name: 'Collected Data', linkTo: '/collected_data', permission: 'data', isClickable: true },
                                { name: 'Show', linkTo: '', permission: '' },]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent
                                data={[
                                    { label: 'Data Name', value: data.name },
                                    { label: 'Indicator', value: data?.indicator },
                                    { label: 'Baseline Data', value: data?.baseline_data },
                                    { label: 'Target Data', value: data?.target_data },
                                    { label: 'Collected Data', value: data?.quantity },
                                    // { label: 'Status', value: StatusCreatorHelperActive(passedData?.status) },

                                ]}
                                titleA="Collected data"
                                titleB={data.full_name}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default CollectedDataShow;