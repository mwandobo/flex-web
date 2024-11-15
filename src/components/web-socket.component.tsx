"use client"

import {useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import ToastComponent from "@/components/tables/toast";

function WebSocketComponent() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8083');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const {for_id, for_name, text, user_id} = data;
            const user_from_storage = getValueFromLocalStorage('user');
            const user = JSON.parse(user_from_storage)

            if (Number(user?.id) === Number(user_id)) {
                ToastComponent({
                    text: text,
                    duration: 10000,
                });
            }
        };

        return () => socket.close();
    }, []);

    return null;
}

export default WebSocketComponent;