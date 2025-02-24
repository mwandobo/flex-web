"use client"

import ProtectedRoute from "@/components/authentication/protected-route";
import MuiCardComponent from "@/components/card/mui-card.component";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {get, post, remove} from "@/utils/api";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import CircleCheckbox from "@/components/inputs/check-circle.component";
import {ReusableButton} from "@/components/button/reusable-button";
import {CheckCircle, CheckCircle2, FileOutput} from "lucide-react";
import SlideOver from "@/components/slide-over/slide-over.component";
import TreeList from "@/components/list/tree-list.component";
import {BID_COMPARISON_APPROVAL_SLUG, FINANCE_APPROVAL_SLUG, ITEM_APPROVAL_SLUG} from "@/utils/constant";
import {useApprovalHook} from "@/hooks/useApprove";
import {useApprovalsAndButtonsHook} from "@/hooks/useApprovalAndButtons.hook";

const BidComparisonView = () => {

    const [data, setData] = useState<any>([])
    const [rfq, setRfq] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const router = useRouter()
    const token = getValueFromLocalStorage('token')

    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id, from: viewFrom} = viewedItem;

    const url = `bid-comparison/${id}`

    const navigateToLogin = () => {
        return router.push('/login')
    }

    const {
        approvalsAndButtonsWrapper,
    } = useApprovalsAndButtonsHook({
        approval_slug: BID_COMPARISON_APPROVAL_SLUG,
        from: BID_COMPARISON_APPROVAL_SLUG,
        from_id: id
    })

    const [selectedCards, setSelectedCards] = useState<any[]>([]);

    const handleCheckboxChange = (itemId: number, supplier: any) => {
        setSelectedCards((prevSelectedCards) => {
            return prevSelectedCards.map((selected) =>
                selected.item_id === itemId ? {
                    ...selected, winner: {
                        supplier_id: supplier.id,
                        quotation_id: supplier.quotation_id,
                        price: supplier.price,
                        quantity: supplier.quantity
                    }
                } : selected
            );
        });
    };

    const handleSubmit = async () => {
        const body = {
            winners: selectedCards
        }
        const response = await post(`bid-comparison/${id}/winners`, body, token)

        if (response.status === 200) {
            setRefresh(!refresh)
        }
    };

    const handleRefreshWinner = async () => {
        const response = await remove(`bid-comparison/${id}/remove-winners`, token)

        if (response.status === 200) {
            setRefresh(!refresh)
        }
    };

    const handleCreatePurchaseOrder = async () => {
        const response = await get(`purchase-orders/rfq/${id}`, token)

        if (response.status === 200) {
            setRefresh(!refresh)
        }
    };

    const isSelected = (itemId: number, supplier: any) => {
        let status = false
        const selection = selectedCards.find((item) => item.item_id === itemId);

        if (selection?.winner.quotation_id && supplier) {
            status = selection?.winner.quotation_id === supplier.quotation_id
        }
        return status
    };

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await get(url, token)

            if (data && res.status === 200) {
                const result = res.data.data
                setData(result)
                setRfq(res.data.rfq)

                console.log(result)


                const bufBody = result.map(item => ({
                    item_id: item.id,
                    winner: {
                        supplier_id: item?.suppliers[0]?.id ?? null,   // First item's supplier_id
                        quotation_id: item?.suppliers[0]?.quotation_id ?? null, // First item's quotation_id
                        price: item?.suppliers[0]?.price ?? null,               // First item's price
                        quantity: item?.suppliers[0]?.quantity ?? null,         // First item's quantity
                    },
                }));

                setSelectedCards(bufBody)
                setLoading(false)
            }

        } catch (error: any) {
            if (error?.code === "ERR_NETWORK") {
                navigateToLogin()
            }
        }
    };


    useEffect(() => {
        fetchData()
    }, [refresh])

    const buttonsBody = () => {
        return <>
            {data?.status === 'bid_comparison' &&
                <ReusableButton
                    name={'Submit Winner'}
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
            {data?.status === 'purchase_order' &&

                <ReusableButton
                    name={'Re Choose Winner'}
                    onClick={() => handleRefreshWinner()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
                </ReusableButton>

            }
            {data?.status === 'purchase_order' &&
                <ReusableButton
                    name={'Create Purchase Order'}
                    onClick={() => handleCreatePurchaseOrder()}
                    rounded={'md'}
                    padding={'p-3'}
                    shadow={'shadow-md'}
                    bg_color={'bg-gray-50'}
                    hover={'hover:bg-gray-200 hover:border-gray-400'}
                    hover_text={'hover:text-gray-900 hover:font-semibold'}
                    border={'border border-gray-300'}
                    text_color={'text-gray-700'}
                >
                    <FileOutput size={13}/>
                </ReusableButton>
            }
        </>
    }


    return (

        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <PageHeader
                            title={'Bid Comparison View'}
                            isShowBackButton={true}
                        />
                        <MuiCardComponent>
                            {data.length <= 0 && 'No quotation Submitted'}
                            {data.map((payloadItem, index) => (
                                <div key={index} className={'grid grid-cols-7 border-t border-gray-300'}>
                                    <div className={'col-span-2 text-xs flex flex-col justify-center'}>
                                        <div className="grid grid-cols-2">
                                            <p className="col-span-1 text-right mr-2">Item Name:</p>
                                            <p className="col-span-1 font-semibold text-left">{payloadItem.item}</p>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <p className="col-span-1 text-right mr-2">Item Price:</p>
                                            <p className="col-span-1 font-semibold text-left">{payloadItem.price}</p>
                                        </div>
                                    </div>

                                    <div className="col-span-5 grid grid-cols-2 gap-4 p-2">
                                        {payloadItem.suppliers.map((supplier, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleCheckboxChange(payloadItem.id, supplier)}
                                                className={`p-4 mb-1 mt-1 mr-1 border border-gray-200 shadow-md text-xs hover:cursor-pointer 
                                                              transform transition-all duration-300 ease-in-out 
                                                              ${supplier?.winner === "winned" ? 'bg-gray-200  hover:bg-gray-300' :
                                                    isSelected(payloadItem.id, supplier) ?
                                                        'bg-gray-200 shadow-lg scale-105 hover:bg-gray-300' :
                                                        `bg-white  ${rfq?.status === "pending" && 'hover:scale-105 hover:bg-gray-200'}   `} 
                                                              hover:shadow-lg `}
                                            >
                                                <div>
                                                    {
                                                        rfq?.status === "bid_comparison" && <CircleCheckbox
                                                            checked={isSelected(payloadItem.id, supplier)}
                                                        />
                                                    }

                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <p className="col-span-1 text-right mr-3">Supplier Name:</p>
                                                    <p className="col-span-1 font-semibold text-left">{supplier.supplierName}</p>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <p className="col-span-1 text-right mr-3">Quotation Price:</p>
                                                    <p className="col-span-1 font-semibold text-left">{supplier.price}</p>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <p className="col-span-1 text-right mr-3">Payment Method:</p>
                                                    <p className="col-span-1 font-semibold text-left">{supplier.payment_method}</p>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <p className="col-span-1 text-right mr-3">Delivery Time:</p>
                                                    <p className="col-span-1 font-semibold text-left">{supplier.delivery_time}</p>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <p className="col-span-1 text-right mr-3">Terms and Conditions:</p>
                                                    <p className="col-span-1 font-semibold text-left">{supplier.terms_and_conditions}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className={'flex justify-end gap-1'}>
                                {data.length > 0 && approvalsAndButtonsWrapper({buttonBody: buttonsBody()})}
                            </div>

                            {/*<div className={'flex justify-between mt-2'}>*/}
                            {/*    <>*/}
                            {/*        {approvalButtonsWrapper()}*/}
                            {/*    </>*/}
                            {/*    <SlideOver*/}
                            {/*        showButton={isNeedApprove}*/}
                            {/*        title="Approval Trail">*/}
                            {/*        <TreeList*/}
                            {/*            url={approval_url}*/}
                            {/*        />*/}
                            {/*    </SlideOver>*/}
                            {/*</div>*/}
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default BidComparisonView;