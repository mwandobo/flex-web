"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import PageHeader from "@/components/header/page-header";
import { getValueFromLocalStorage } from "@/utils/actions/local-starage";
import { capitalizeFirstWord } from "@/utils/actions/string-manipulations";
import { get } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ExternalUserShow = ({ params }: { params: { externalId: string } }) => {
    const router = useRouter()
    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')

    // const token = 'token'
    const id = params.externalId
    const group = getValueFromLocalStorage('group')

    const url = `undefined/external_users/${group}/show/${id}`
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
                                { name: capitalizeFirstWord(group), linkTo: '/admnistration/external', permission: `${group}s`, isClickable: true },
                                { name: 'Show', linkTo: '/admnistration/external/view', permission: '' },
                            ]}
                            isShowPage={true}
                        />
                        <MuiCardComponent>
                            <ViewCardComponent

                                data={[
                                    { label: `${capitalizeFirstWord(group)} Name`, value: data?.name },
                                    { label: 'Phone', value: data?.phone },
                                    { label: 'Email', value: data?.email },
                                    { label: 'Type', value: data?.type },
                                ]}
                                titleA={capitalizeFirstWord(group)}
                                titleB={` ${data?.name} `}
                            />

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default ExternalUserShow;