"use client"

import ProtectedRoute from '@/components/authentication/protected-route'
import { getValueFromLocalStorage } from '@/utils/actions/local-starage'
import { get } from '@/utils/api'
import React, { useEffect, useState } from 'react'

interface Props {
    from?: string | null
    from_id?: string | null
    means_of_verification?: string | null
    project_id?: string | null
    isHideAdd?: boolean

}

function LogFrame({
    from,
    from_id,
    project_id,
    means_of_verification,
    isHideAdd

}: Props) {

    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)



    const token = getValueFromLocalStorage('token')

    const itemsFinder = () => {

    }



    const url = `indicator/${project_id}/${from}/${from_id}`

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const res = await get(`project/logframe/${project_id}`, token)

            if (res && res.status === 200) {
                setData(res.data.data)
                setLoading(false)
            }
        };
        fetchData()
    }, [project_id, token])


    console.log(data)




    return (
        <ProtectedRoute>
            {
                loading ? <p>Loading...</p>
                    :
                    <>
                        <div className='flex flex-col bg-gray-50 '>
                            {data?.goals?.length > 0 && data.goals.map((goal, i) =>
                                <div key={i}>
                                    <div className='flex border-b border-t border-gray-300'>
                                        <div className='w-1/5 border-r border-gray-300 flex items-center ps-2'>
                                            <p>Goal</p>
                                        </div>
                                        <div className='w-full flex items-center'>
                                            <p className='p-1'> {`${goal.formatted_code}. ${goal.name}`}</p>
                                        </div>
                                    </div>
                                    <div className='flex border-b border-t border-gray-300'>
                                        <div className='w-1/5 border-r border-gray-300 flex items-center ps-2'>
                                            <p>Objective(s) / Outcome(s)</p>
                                        </div>
                                        <div className='w-full flex items-center'>
                                            {goal?.outcomes?.length > 0 && goal.outcomes.map(outcome =>
                                                <p key={outcome.id} className='p-1'> {`${outcome.formatted_code}. ${outcome.name}`}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex border-b border-t border-gray-300'>
                                        <div className='w-1/5 border-r border-gray-300 flex items-center ps-2'>
                                            <p>Outputs</p>
                                        </div>
                                        <div className='w-full flex items-center'>
                                            {goal?.outputs?.length > 0 && goal.outputs.map(output =>
                                                <p key={output.id} className='p-1'> {`${output.formatted_code}. ${output.name}`}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex border-b border-t border-gray-300'>
                                        <div className='w-1/5 border-r border-gray-300 flex items-start ps-2'>
                                            <p>Activities</p>
                                        </div>
                                        <div className='w-full flex flex-col justify-center'>
                                            {goal?.activities?.length > 0 && goal.activities.map(activity =>

                                                <p key={activity.id} className='p-1'> {`${activity.formatted_code}. ${activity.name}`}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
            }
        </ProtectedRoute>
    )
}

export default LogFrame