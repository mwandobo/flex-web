'use client'
import React, {useEffect,} from "react";
import {useRouter} from "next/navigation";
import {getValueFromLocalStorage, removeValueFromLocalStorage} from "@/utils/actions/local-starage";
import {useGlobalContextHook} from "@/hooks/useGlobalContextHook";
import ProfileDropdown from "@/components/dropdown/profile-dropdown.component";
import NotificationComponent from "@/components/notification/notification-component";
import {Menu, X} from "lucide-react";

function Header() {
    const router = useRouter();
    const token = getValueFromLocalStorage('token') || '';
    const {state, dispatch} = useGlobalContextHook()
    const {currentUser, isSideBarHidden} = state;

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
            dispatch({type: "UPDATE_HIDE_SIDEBAR", payload: !isSideBarHidden})
    }

    return (
        <nav className="w-full flex justify-between p-2 py-3 border-b border-gray-200 bg-white">
            {/* Logo + toggle (only for small screens) */}
            <div className={`flex items-center md:ps-8`}>
                <button onClick={toggleSideBar} className="me-3 md:hidden">
                    {isSideBarHidden ?<Menu size={32} strokeWidth={2}/>  : <X size={32} strokeWidth={2}/> }
                </button>
                <img src="/logo.png" alt="logo" className="h-10 w-auto"/>
            </div>

            {/* Right section */}
            <div className="flex items-center justify-end gap-2 me-4">
                <NotificationComponent/>
                <ProfileDropdown name={currentUser?.email} handleLogout={handleLogout}/>
            </div>
        </nav>
    );
}

export default Header
