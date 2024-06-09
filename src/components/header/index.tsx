'use client'
import React, { Suspense, useEffect, useState } from "react";
import Button from "../button";
import { useRouter } from "next/navigation";
import { getValueFromLocalStorage, removeValueFromLocalStorage } from "@/utils/actions/local-starage";
import { useGlobalContextHook } from "@/hooks/useGlobalContextHook";

function Header() {
    const router = useRouter();
    const token = getValueFromLocalStorage('token') || '';


    const { state, dispatch } = useGlobalContextHook()

    const { currentUser } = state;



    useEffect(() => {
        // Function to get user information from localStorage
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
        <nav className="w-full px-3 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center justify-end">
                <div className="me-4 text-xs">
                    {
                        !currentUser ? <div></div> :
                            <div className="">
                                <p>{`${currentUser?.first_name} ${currentUser?.last_name}`}</p>
                                <p>{currentUser?.email}</p>
                            </div>
                    }
                </div>
                <Button text="Logout" onClick={handleLogout} />
            </div>
        </nav>
    );
}

export default Header
