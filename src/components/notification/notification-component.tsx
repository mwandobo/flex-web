'use client';

import React, {useEffect, useState} from 'react';
import {Bell, Circle, MailOpen, Trash} from 'lucide-react';
import DropdownComponent from '@/components/dropdown/dropdown.component';
import {useGlobalContextHook} from '@/hooks/useGlobalContextHook';
import {getValueFromLocalStorage, setValueLocalStorage} from '@/utils/actions/local-starage';
import {get, remove} from "@/utils/api";

const NotificationComponent = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [expandedNotification, setExpandedNotification] = useState<number | null>(null); // Track expanded notification
    const {state, dispatch} = useGlobalContextHook();
    const token = getValueFromLocalStorage("token");

    const {notificationBody} = state;
    const numberOfNotifications = notificationBody?.count;
    const notes = notificationBody?.notifications;

    useEffect(() => {
        const notificationBody = getValueFromLocalStorage('notificationBody');

        if (notificationBody) {
            const _notificationBody = JSON.parse(notificationBody);
            dispatch({type: 'UPDATE_NOTIFICATION_BODY', payload: _notificationBody});
        }
    }, []);

    const toggleIsDropdownOpen = () => {
         setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNotificationDispatch = (notifications: any[]) => {
        const notificationPayload = {
            count: notifications.filter((note: any) => !note.is_read ).length,
            notifications: notifications,
        };

        // // Update state and local storage
        dispatch({type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload});
        setValueLocalStorage("notificationBody", JSON.stringify(notificationPayload));
    }

    const toggleExpand = async (index: number) => {
        setExpandedNotification(expandedNotification === index ? null : index);
        const note = notes[index]// Toggle expanded state

        if (!note?.is_read) {
            try {
                const updatedNotification = await get(`notifications/${note?.id}/read`, token);
                if (updatedNotification.status === 200) {
                    notes[index] = {...note, is_read: true}
                    handleNotificationDispatch(notes)
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }
    };

    const handleDelete = async (index: number, event: any) => {
        event.stopPropagation();
        const note = notes[index]// Toggle expanded state

        try {
            const updatedNotification = await remove(`notifications/${note?.id}`, token);
            if (updatedNotification.status === 200) {
                const newNotes = notes.filter((note, _index) => Number(_index) !== Number(index))
                handleNotificationDispatch(newNotes)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleReadAll = async () => {
        try {
            const updatedNotificationResult = await get(`notifications/read-all`, token);
            if (updatedNotificationResult.status === 200) {
                const newNotes = notes.map(note => {
                    return {...note, is_read: true }
                })
                handleNotificationDispatch(newNotes)
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            const updatedNotificationResult = await get(`notifications/delete-all`, token);
            if (updatedNotificationResult.status === 200) {
                handleNotificationDispatch([])
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
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
                <Bell className={'text-gray-500 '}/>
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
                        <div className={'flex justify-between items-center mb-2'}>
                            <h3 className={'font-medium text-sm'}>Notifications</h3>

                            <div className={'flex gap-2'}>
                                <button
                                    onClick={handleDeleteAll}
                                >
                                    <Trash size={14} strokeWidth={3} className={'text-red-400'}/>
                                </button>
                                <button

                                    onClick={handleReadAll}
                                >
                                    <MailOpen size={14} strokeWidth={3} className={'text-gray-600'}/>
                                </button>
                            </div>
                        </div>
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
                                            {!note.is_read ?
                                                <Circle size={6} className={'text-red-500 me-1'} strokeWidth={6}/> :
                                                <p className={'ms-2'}></p>
                                            }
                                            <p className="me-1">{index + 1}</p>
                                            <p>{note.title}</p>
                                        </div>
                                        <div className={'flex gap-2 items-center'}>
                                            <button
                                                onClick={(event) => handleDelete(index, event)}
                                                className={'z-10'}
                                            >
                                                <Trash size={10} strokeWidth={4} className={'text-red-400'}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {expandedNotification === index && (
                                        <div className="mt-2 text-gray-700 ps-4">
                                            <p className={`border  ${index % 2 === 0 ? 'border-gray-200' : 'border-gray-300'} p-1 ps-2 rounded-md`}>{note?.description }</p>
                                            <div className={'flex gap-3 justify-end'}>
                                                <p style={{fontSize: '9px'}}>Sender: {note?.user_name || 'Unknown'}</p>
                                                <p style={{fontSize: '9px'}}>Sent On: {note?.formatted_date || 'Unknown'}</p>
                                            </div>
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
