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
import {CheckCircle2,} from "lucide-react";
import {useCrudOperator} from "@/hooks/crud/crud-operator";
import {ITEM_APPROVAL_SLUG} from "@/utils/constant";
import Warranty from "@/app/inventory/warranty/warranty";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const ItemsView = () => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, } = useGlobalContextHook()
    const { viewedItem} = state;
    const {id,} = viewedItem;

    const url = `item/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: ITEM_APPROVAL_SLUG,
        from: ITEM_APPROVAL_SLUG,
        from_id: id
    })

    const formInputs = [
        {
            name: 'quantity',
            type: 'text',
            label: 'Quantity',
            value: '',
            required: true,
            isError: false,
            errorMessage: ''
        },
    ]

    const {
        handleClick,
        createdForm,
        isStateChanged
    } = useCrudOperator({
        formInputData: formInputs,
        incomingUrl: `requisition-request/item/${id}`,
        incomingModalTitle: "Requisition Request",
        viewUrl: "",
        state_properties: [],
        from: 'item-requisition',
        isApiV2: true
    })

    const buttonsBody = () => {
        return <ReusableButton
            name={'Add Item to Requisition Request'}
            onClick={() => handleClick('create')}
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
    }, [isStateChanged])

    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Item View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            <div className="mb-3">
                                <ViewCardComponent
                                    data={[
                                        {label: 'Item Name', value: data?.name},
                                        {label: 'Item Category', value: data?.category_name},
                                        {label: 'Quantity', value: data?.quantity},
                                        {label: 'Price', value: data?.price},
                                        {label: 'Description', value: data?.description},
                                    ]}
                                    titleA={`Item`}
                                    titleB={` ${data?.name} `}
                                    OptionalElement={approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                                />
                            </div>
                            <hr className="bg-gray-100"/>
                            <Warranty from={'item'} from_id={id} is_warranted={data.is_warranted}/>
                        </MuiCardComponent>
                        {createdForm()}
                    </>
            }
        </ProtectedRoute>
    );
};

export default ItemsView;