"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React, {useState} from 'react'
import {setValueLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import PageHeader from "@/components/header/page-header-v1";
import ItemsCategories from "@/app/inventory/items-categories/items-categories";
import ItemsCategoryView from "@/app/inventory/items-categories/items-category-view";

function Inventory() {
    const [loading, setLoading] = useState(false)
    const {state, dispatch} = useGlobalContextHook()
    const {selectedSubSidebarItem: selected, viewedItem} = state;
    const {id: viewId, from: viewFrom} = viewedItem;

    const handleMonitoringItemChange = (item: string) => {
        dispatch({type: "SET_SUB_SIDEBAR_ITEM", payload: item})
        setValueLocalStorage('selected_sub_sidebar_item', item)
        setValueLocalStorage('sub_view_item', JSON.stringify({id: '', from: ''}))
        dispatch({type: "SET_SUB_VIEW_ITEM", payload: {id: '', from: ''}})
    }

    const pageItems = [
        {'name': 'item-categories', item: <ItemsCategories/>, itemView: <ItemsCategoryView/>}
    ]

    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="flex flex-col h-full bg-white">
                        <PageHeader
                            title="Inventory Management"
                        />
                        <div className="flex bg-white h-full ">
                            <div className="flex flex-col w-64 mt-4 ml-4 p-2 border-r border-gray-200">
                                <h4 className="text-sm font-semibold mb-2">Inventory Items</h4>
                                <div className="flex flex-col justify-between h-full">
                                    <button
                                        className={`p-1 text-start text-sm hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'item-categories' && 'bg-sidebar-background text-sidebar-active'} `}
                                        onClick={() => handleMonitoringItemChange('item-categories')}>
                                        Items Category
                                    </button>
                                    <button
                                        className={`p-1 text-start text-sm hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'items' && 'bg-sidebar-background text-sidebar-active'}`}
                                        onClick={() => handleMonitoringItemChange('items')}>
                                        Items
                                    </button>
                                    <button
                                        className={`p-1 text-start text-sm hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'suppliers' && 'bg-sidebar-background text-sidebar-active'}`}
                                        onClick={() => handleMonitoringItemChange('suppliers')}>
                                        Suppliers
                                    </button>
                                    <button
                                        className={`p-1 text-start text-sm hover:bg-sidebar-background hover:text-sidebar-active ${selected === 'stores' && 'bg-sidebar-background text-sidebar-active'}`}
                                        onClick={() => handleMonitoringItemChange('stores')}>
                                        Stores
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col p-4 h-full w-full bg-white">
                                <div className="flex flex-col p-4 h-full w-full bg-white">
                                    <div>
                                        {
                                            pageItems.map((item, index) => (
                                                <div key={index}>
                                                    {item.name === selected && <>{
                                                        viewId ?
                                                            <>
                                                                {
                                                                    item.itemView
                                                                }
                                                            </> :
                                                            <>
                                                                {
                                                                    item.item
                                                                }
                                                            </>
                                                    }</>}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }
        </ProtectedRoute>
    );
}

export default Inventory