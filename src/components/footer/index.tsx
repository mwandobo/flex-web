import React from "react"

const Footer = () => {
    return (
        <div className=" w-full flex flex-col  justify-center items-center bg-white text-gray-600 text-sm p-4">
            <p >&copy; {new Date().getFullYear()} Flex Projects. All rights reserved.</p>
        </div>
    )
}

export default Footer