"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import React from 'react'
import { setValueLocalStorage } from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";

type PageItem = {
  name: string;
  title: string;
  item: React.ReactNode;
  itemView?: React.ReactNode;
};

type InventoryProps = {
  pageItems: PageItem[];
  title: string;
  subtitle: string;
};

function InternalMenuSkeletonComponent({ pageItems, title , subtitle}: InventoryProps) {
  const { state, dispatch } = useGlobalContextHook();
  const { selectedSubSidebarItem: selected, viewedItem } = state;
 const viewId = viewedItem?.id

  const handleMonitoringItemChange = (item: string) => {
    dispatch({ type: "SET_SUB_SIDEBAR_ITEM", payload: item });
    setValueLocalStorage('selected_sub_sidebar_item', item);
    setValueLocalStorage('sub_view_item', JSON.stringify({ id: '', from: '' }));
    dispatch({ type: "SET_SUB_VIEW_ITEM", payload: { id: '', from: '' } });
  };

  return (
      <ProtectedRoute>
        <div className="flex flex-col h-full bg-white">
          <h3 className="text-md text-center font-semibold pt-2">{title}</h3>
          <div className="flex bg-white h-full ">
            {/* Sidebar */}
            <div className="flex flex-col w-48 mt-4 ml-4 p-2 border-r border-gray-200">
              <h4 className="text-sm font-medium mb-2">{subtitle}</h4>
              <div className="flex flex-col h-full">
                {pageItems.map((item, index) => (
                    <button
                        key={index}
                        className={`p-1 text-start text-sm hover:bg-sidebar-background hover:text-sidebar-active ${selected === item.name && 'bg-sidebar-background text-sidebar-active'} `}
                        onClick={() => handleMonitoringItemChange(item.name)}>
                      {item.title}
                    </button>
                ))}
              </div>
            </div>

            {/* Content */}
              <div className="flex flex-col p-4 h-full w-full bg-white">
                {pageItems.map((item, index) => (
                    <div key={index}>
                      {item.name === selected && (
                          <>
                            {viewId ? item.itemView : item.item}
                          </>
                      )}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
  );
}

export default InternalMenuSkeletonComponent;
