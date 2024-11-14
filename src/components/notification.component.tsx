"use client"

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getValueFromLocalStorage} from "@/utils/actions/local-starage";


function NotificationComponent() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8083');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { for_id ,for_name,  text, user_id } = data;
            const user_from_storage = getValueFromLocalStorage('user');
            const user = JSON.parse(user_from_storage)

            if( Number(user?.id) === Number( user_id )){
                toast.success(text, {
                    position: "top-right",
                    autoClose: 10000, // 10 seconds
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };

        return () => socket.close();
    }, []);

    return null;
}

export default NotificationComponent;