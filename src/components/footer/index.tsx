import React from "react"

const Footer = () => {
    return (
        <div className="fixed bottom-0 w-full pr-80 flex flex-col justify-end items-center bg-white text-gray-600 text-sm">
            <p >&copy; {new Date().getFullYear()} Flex Projects. All rights reserved.</p>
        </div>
    )
}

export default Footer