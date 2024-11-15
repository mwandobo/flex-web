// components/Notification.js
import React from 'react';

const PushNotification = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div
            className={`fixed top-5 right-5 p-4 rounded-lg text-white shadow-lg flex justify-between items-center space-x-4
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
            <span>{message}</span>
            <button onClick={onClose} className="text-2xl font-bold">&times;</button>
        </div>
    );
};

export default PushNotification;
