'use client'

import React, {useEffect, useState} from 'react';
import {Bell} from "lucide-react";
import DropdownComponent from "@/components/dropdown/dropdown.component";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";

const NotificationComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const {state, dispatch} = useGlobalContextHook()
    const {notificationBody} = state;
    const numberOfNotifications = notificationBody?.count
    const notes = notificationBody?.notifications

    useEffect(() => {
        const notificationBody = getValueFromLocalStorage('notificationBody');

        if (notificationBody) {
            const _notificationBody = JSON.parse(notificationBody);
            dispatch({type: "UPDATE_NOTIFICATION_BODY", payload: _notificationBody});
        }
    }, [])

    const toggleIsDropdownOpen = () => {
        numberOfNotifications > 0 && setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div className={''}>
            <button
                onClick={toggleIsDropdownOpen}
                className={`flex flex-col items-center space-x-2 focus:outline-none p-2 rounded-full ${numberOfNotifications > 0 && 'animate-pulse border border-gray-200'}`}
            >
                <Bell className={'text-gray-500 '}/>
                <span
                    className={'ps-4 -mt-2 text-xs text-red-400 font-semibold'}>{numberOfNotifications > 0 ? numberOfNotifications : ''}</span>
            </button>
            <div className={'bg-red-200'}>
                <DropdownComponent name={'Notifications'} toggleOpen={toggleIsDropdownOpen} isOpen={isDropdownOpen}>
                    <div className={'w-full flex flex-col text-xs'}>
                        <h3 className={'font-medium mb-2 text-center w-full'}>Notifications</h3>
                        <div className={'w-full flex flex-col'}>
                            {
                                notes.map((note, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${index % 2 === 0 ? 'bg-white ' : 'bg-gray-100'} p-2 mb-1`}
                                    >
                                        <p className="me-1">{index + 1}</p>
                                        <p>{note.text}</p>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </DropdownComponent>
            </div>
        </div>
    );
}

export default NotificationComponent;
