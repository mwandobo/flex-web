"use client";

import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getValueFromLocalStorage, setValueLocalStorage } from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import ToastComponent from "@/components/tables/toast";

function WebSocketComponent() {
    const { state, dispatch } = useGlobalContextHook();

    const handleNotificationDispatch = (notifications: any[]) => {
        const notificationPayload = {
            count: notifications.filter((note: any) => !note.is_read).length,
            notifications,
        };

        // Update state and local storage
        dispatch({ type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload });
        setValueLocalStorage("notificationBody", JSON.stringify(notificationPayload));
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8083");

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { for_id, for_name, description, title, notified_personnel_id } = data;

            const userFromStorage = getValueFromLocalStorage("user");
            const user = JSON.parse(userFromStorage);

            if (Number(user?.id) === Number(notified_personnel_id)) {
                const newNotes = [data, ...(state?.notificationBody?.notifications || []) ];
                handleNotificationDispatch(newNotes);
                ToastComponent({text: title, duration: 1000, position: 'top-right'})
            }
        };

        // Clean up WebSocket connection on component unmount
        return () => socket.close();
    }, [state.notificationBody.notifications]); // Add to dependency array

    return null;
}

export default WebSocketComponent;
