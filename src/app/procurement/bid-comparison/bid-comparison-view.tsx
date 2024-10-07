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
import {CheckCircle} from "lucide-react";

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

    const handleCreatePurchaseRequest = async () => {
        const response = await remove(`bid-comparison/${id}/remove-winners`, token)

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

                const bufBody = result.map(item => ({
                    item_id: item.id,
                    winner:
                        {
                            supplier_id: null,
                            quotation_id: null,
                            price: null,
                            quantity: null
                        },
                }))

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
                                                                   `bg-white  ${rfq?.status ==="pending" && 'hover:scale-105 hover:bg-gray-200'}   `} 
                                                              hover:shadow-lg `}
                                            >
                                                <div>
                                                    {
                                                        rfq?.status === "pending" && <CircleCheckbox
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
                                {rfq?.status === "pending" && <ReusableButton name={'Submit'} onClick={handleSubmit}> <CheckCircle size={10} /> </ReusableButton>}
                                {rfq?.status === "bid-comparison" && <ReusableButton name={'Re Choose Winner'} onClick={handleRefreshWinner}>  <CheckCircle size={10} /> </ReusableButton>}
                                {rfq?.status === "bid-comparison" && <ReusableButton name={'Create Purchase Request'} onClick={handleCreatePurchaseRequest}> <CheckCircle size={10} /> </ReusableButton>}
                            </div>
                        </MuiCardComponent>
                    </>
            }
        </ProtectedRoute>
    );
};

export default BidComparisonView;