'use client'
import React, {useEffect,} from "react";
import {useRouter} from "next/navigation";
import {getValueFromLocalStorage, removeValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import ProfileDropdown from "@/components/dropdown/profile-dropdown.component";
import NotificationComponent from "@/components/notification/notification-component";
import {Menu} from "lucide-react";

function Header() {
    const router = useRouter();
    const token = getValueFromLocalStorage('token') || '';
    const {state, dispatch} = useGlobalContextHook()
    const {currentUser, hideSideBar} = state;

    useEffect(() => {
        const getUserInfo = () => {
            const userInfo = token ? JSON.parse(getValueFromLocalStorage('user')) : null;
            if (userInfo) {
                dispatch({type: "SET_CURRENT_USER", payload: userInfo})
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

    const toggleSideBar = () => {
            dispatch({type: "UPDATE_HIDE_SIDEBAR", payload: !hideSideBar})
    }

    return (
        <nav className="w-full flex justify-end p-2 py-3 bg-white">
            <div className="flex items-center justify-end me-8 gap-2">
                <NotificationComponent/>
                <ProfileDropdown name={currentUser?.email} handleLogout={handleLogout}/>
            </div>
        </nav>
    );
}

export default Header
