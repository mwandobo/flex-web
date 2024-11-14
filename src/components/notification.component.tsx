"use client"

import { useEffect } from 'react';
import Swal from 'sweetalert2';

function NotificationComponent() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8083');

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('sdbgklajsdgj;abfdgbadfk')
            Swal.fire({
                title: 'Message Received',
                text: JSON.stringify(message),
                icon: 'info',
            });
        };

        return () => socket.close();
    }, []);

    return null;
}

export default NotificationComponent;