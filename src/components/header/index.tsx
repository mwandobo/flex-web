'use client'
import React, {useEffect,} from "react";
import { useRouter } from "next/navigation";
import { getValueFromLocalStorage, removeValueFromLocalStorage } from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";
import ProfileDropdown from "@/components/dropdown/profile-dropdown.component";
import NotificationComponent from "@/components/notification/notification-component";

function Header() {
    const router = useRouter();
    const token = getValueFromLocalStorage('token') || '';
    const { state, dispatch } = useGlobalContextHook()
    const { currentUser } = state;

    useEffect(() => {
        const getUserInfo = () => {
            const userInfo = token ? JSON.parse(getValueFromLocalStorage('user')) : null;
            if (userInfo) {
                dispatch({ type: "SET_CURRENT_USER", payload: userInfo })
            }
        };
        getUserInfo(); // Call function on component mount
    }, []);

    const handleLogout = () => {
        try {
            removeValueFromLocalStorage('user');
            removeValueFromLocalStorage('token');
            router.push('/login');
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    return (
        <nav className="w-full flex justify-between p-2 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 mb-6">
            <img className='h-10 w-fit ms-4' src="/logo.png" alt="logo"/>
            <div className="flex items-center justify-end me-8 gap-2">
                <NotificationComponent />
                <ProfileDropdown name={currentUser?.email} handleLogout={handleLogout}/>
            </div>
        </nav>
    );
}

export default Header
