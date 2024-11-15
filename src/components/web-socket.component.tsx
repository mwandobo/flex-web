"use client";

import {useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import {getValueFromLocalStorage, setValueLocalStorage} from "@/utils/actions/local-starage";
import ToastComponent from "@/components/tables/toast";
import {get} from "@/utils/api";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";

function WebSocketComponent() {
    const token = getValueFromLocalStorage("token");
    const {dispatch} = useGlobalContextHook();

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8083");

        // Make the onmessage handler asynchronous
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            const {for_id, for_name, description, title, user_id} = data;

            const user_from_storage = getValueFromLocalStorage("user");
            const user = JSON.parse(user_from_storage);

            if (Number(user?.id) === Number(user_id)) {
                try {
                    const notificationResult = await get(`notifications?user_id=${user?.id}`, token);
                    if (notificationResult.status === 200) {
                        const notifications = notificationResult.data.data;
                        const notificationPayload = {
                            count: notifications.filter((note: any) => !note.is_read).length,
                            notifications: notifications,
                        };

                        // Update state and local storage
                        dispatch({type: "UPDATE_NOTIFICATION_BODY", payload: notificationPayload});
                        setValueLocalStorage("notificationBody", JSON.stringify(notificationPayload));

                        ToastComponent({
                            text: title,
                            duration: 10000,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        // Clean up WebSocket connection on component unmount
        return () => socket.close();
    }, []);

    return null;
}

export default WebSocketComponent;
