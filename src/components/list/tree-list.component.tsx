import React, {useEffect, useState} from 'react';
import {get} from "@/utils/api";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

interface Props {
    url: string,
}

const TreeList = ({
                      url,
                  }: Props) => {

    const [data, setData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const token = getValueFromLocalStorage('token')
    const { state } = useGlobalContextHook()
    const { viewItemRefreshAfterApproval} = state

    useEffect(() => {
        const fetchData = async () => {
            try {

                setLoading(true)


                const res = await get(url, token)


                if (res.status === 200) {
                    setData(res.data.data)
                    setLoading(false)
                }

            } catch (error: any) {
                console.log(error)
            }
        };
        fetchData()
    }, [viewItemRefreshAfterApproval])

    return (
        <>
            {
                loading ? <p>Loading...</p>
                    :
                    <div className="ml-5">
                        <ul className="space-y-4 relative">
                            {data.map((item, index) => (
                                <li key={index} className="relative">
                                    {/* Line connecting the parents */}
                                    <div className={`absolute w-1 h-full ${item?.type === 'approve' ? 'bg-green-100' : "bg-red-100"} bg-gray-300 left-0 top-0`}></div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            <div className={`w-5 h-1 ${item?.type === 'approve' ? 'bg-green-100' : "bg-red-100"}`}></div>
                                            <span className="ml-2 text-gray-700 font-medium text-xs">Approval Level:</span>
                                        </div>
                                        <span className="font-bold">{item.approval_level_name}</span>
                                    </div>
                                    {/* Child list */}
                                    <ul className={`ml-3 mt-1 transition-all duration-300 ease-in-out block`}>
                                        <li className="relative p-1">
                                            <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <div className="w-1 h-px bg-gray-400"></div>
                                                    <span
                                                        className="ml-2 text-gray-700 font-medium text-xs">Status:</span>
                                                </div>
                                                <span className='text-xs font-semibold'>
                                                    {item.type === "approve" ? (
                                                        <span className='bg-green-50 p-1'>Approved</span>
                                                    ) : (
                                                        <span className='bg-red-50 p-1'>Disapproved</span>
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                        <li className="relative p-1">
                                            <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <div className="w-1 h-px bg-gray-400"></div>
                                                    <span className="ml-2 text-gray-700 font-medium text-xs">Approved By:</span>
                                                </div>
                                                <span className="ml-2 text-xs font-semibold">{item.approved_by_name}</span>
                                            </div>
                                        </li>
                                        <li className="relative p-1">
                                            <div className="absolute w-px h-full bg-gray-300 left-0 top-0"></div>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center">
                                                    <div className="w-1 h-px bg-gray-400"></div>
                                                    <span
                                                        className="ml-2 text-gray-700 font-medium text-xs">Remark:</span>
                                                </div>
                                                <span className="ml-2 text-xs font-semibold">{item.remark}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
            }
        </>
    );
};

export default TreeList;
