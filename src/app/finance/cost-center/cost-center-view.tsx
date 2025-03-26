"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import ViewCardComponent from "@/components/card/view.card.component";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get} from "@/utils/api";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle2, FileOutput} from "lucide-react";
import moneyFormater from "@/components/moneyFormater";
import {
    COST_CENTER_APPROVAL_SLUG,
} from "@/utils/constant";
import {showConfirmationModal} from "@/utils/showAlertDialog";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";
import CostCenterTransactions from "@/app/finance/cost-center/cost-center-transactions";

const CostCenterView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, } = useGlobalContextHook()
    const { viewedItem} = state;
    const {id} = viewedItem;

    const url = `cost-centers/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: COST_CENTER_APPROVAL_SLUG,
        from: COST_CENTER_APPROVAL_SLUG,
        from_id: id
    })

    const onSave = async (url: string) => {
        try {
            const res = await get(url, token);
            if (data && res.status === 200) {
                setRefresh(!refresh);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleSubmit = () => {
        showConfirmationModal({
            title: 'Are You Sure?',
            text: `Are You Sure You Want To Submit Cost Center: ${data.formatted_code}?`,
            onConfirm: () => onSave(`${url}/submit-draft`),  // Action to perform on confirmation
            onCancel: () => console.log('User canceled the action'), // Optional cancel action
        });
    };


    const buttonsBody = () => {
        return <>

            {data?.status === 'pending' &&
                <ReusableButton
                    name={'Submit Cost Center'}
                    onClick={() => handleSubmit()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <CheckCircle2 size={13}/>
                </ReusableButton>
            }

        </>
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
    }, [refresh])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Cost Center'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Cost Center Code', value: data?.formatted_code},
                                        {label: 'Cost Center Name', value: data?.name},
                                        {label: 'Cost Center Amount', value:  moneyFormater({amount:data?.amount}) },
                                        {label: 'Cost Center Handler', value: data?.handler_name},
                                        {label: 'Status', value: data?.status},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Cost Center`}
                                    titleB={` ${data?.formatted_code} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <CostCenterTransactions cost_center={data}/>

                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default CostCenterView;