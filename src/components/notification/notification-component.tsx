'use client';

import React, {useEffect, useState} from 'react';
import {Bell, Circle} from 'lucide-react';
import DropdownComponent from '@/components/dropdown/dropdown.component';
import {useGlobalContextHook} from '@/hooks/useGlobalContextHook';
import {getValueFromLocalStorage, setValueLocalStorage} from '@/utils/actions/local-starage';
import {get} from "@/utils/api";

const NotificationComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedNotification, setExpandedNotification] = useState<number | null>(null); // Track expanded notification
    const { state, dispatch } = useGlobalContextHook();
    const token = getValueFromLocalStorage("token");

    const { notificationBody } = state;
    const numberOfNotifications = notificationBody?.count;
    const notes = notificationBody?.notifications;

    useEffect(() => {
        const notificationBody = getValueFromLocalStorage('notificationBody');

        if (notificationBody) {
            const _notificationBody = JSON.parse(notificationBody);
            dispatch({ type: 'UPDATE_NOTIFICATION_BODY', payload: _notificationBody });
        }
    }, []);

    const toggleIsDropdownOpen = () => {
        numberOfNotifications > 0 && setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleExpand = async (index: number) => {
        setExpandedNotification(expandedNotification === index ? null : index);

        const note = notes[index]// Toggle expanded state

        console.log('note', note)
        if(!note?.is_read){
            try {
                const updatedNotification = await get(`notifications/${note?.id}`, token);
                if (updatedNotification.status === 200) {
                    notes[index] = updatedNotification.data.data

                    const notificationPayload = {
                        count: notes.length,
                        notifications: notes,
                    };

                    // // Update state and local storage
                    dispatch({ type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload });
                    setValueLocalStorage("notificationBody", JSON.stringify(notificationPayload));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }
    };

    return (
        <div className={''}>
            <button
                onClick={toggleIsDropdownOpen}
                className={`flex flex-col items-center space-x-2 focus:outline-none p-2 rounded-full ${
                    numberOfNotifications > 0 && 'animate-pulse border border-gray-200'
                }`}
            >
                <Bell className={'text-gray-500 '} />
                <span
                    className={
                        'ps-4 -mt-2 text-xs text-red-400 font-semibold'
                    }
                >
                    {numberOfNotifications > 0 ? numberOfNotifications : ''}
                </span>
            </button>
            <div className={'bg-red-200'}>
                <DropdownComponent name={'Notifications'} toggleOpen={toggleIsDropdownOpen} isOpen={isDropdownOpen}>
                    <div className={'w-full flex flex-col text-xs'}>
                        <h3 className={'font-medium mb-2 text-center w-full'}>Notifications</h3>
                        <div className={'w-full flex flex-col'}>
                            {notes && notes?.map((note, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col ${index % 2 === 0 ? 'bg-white ' : 'bg-gray-100'} p-2 mb-1 ${!note.is_read && 'text-xs font-semibold'}`}
                                    onClick={() => toggleExpand(index)} // Expand row on click
                                >
                                    {/* Main row */}
                                    <div className={'flex justify-between'}>
                                        <div className="flex items-center">
                                            <p className="me-1">{index + 1}</p>
                                            <p>{note.text}</p>
                                        </div>
                                        <Circle size={8} className={'text-red-500'} strokeWidth={4}/>
                                    </div>

                                    {/* Expanded details */}
                                    {expandedNotification === index && (
                                        <div className="mt-2 text-gray-500 ">
                                            <p>Sender: {note.senderName || 'Unknown'}</p>
                                            <p>Sent On: {note.sentDate || 'Unknown'}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </DropdownComponent>
            </div>
        </div>
    );
};

export default NotificationComponent;
