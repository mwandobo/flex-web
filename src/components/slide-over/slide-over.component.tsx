import { useEffect, useState } from "react";
import {BadgeInfo} from "lucide-react";

interface SlideOverProps {
    title?: string;
    width?: string;
    showButton?: boolean;
    children: React.ReactNode;
}

const SlideOver: React.FC<SlideOverProps> = ({
                                                 title = "Approval Trail",
                                                 width = "25%",
                                                 children,
                                                 showButton
                                             }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the SlideOver
    const toggleSlideOver = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Button to open the slide-over */}
            {
                showButton && <button onClick={toggleSlideOver}
                                      className="flex items-center gap-2 px-2 py-1 text-xs bg-blue-200 text-gray-600 hover:bg-blue-400 hover:text-gray-700 rounded">
                    <span><BadgeInfo size={12}/></span>
                    View Approvals
                </button>
            }

            {/* Slide-over Container */}
            <div
                className={`fixed inset-0 z-50 overflow-hidden transition-all ease-in-out duration-500 ${
                    isOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                    onClick={toggleSlideOver}
                />

                {/* Slide Over */}
                <div
                    className={`fixed right-0 top-0 bottom-0 bg-white shadow-xl transform transition-transform duration-500 ease-in-out ${
                        isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ width }}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button onClick={toggleSlideOver} className="text-gray-500 hover:text-gray-800">
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto">{children}</div>
                </div>
            </div>
        </>
    );
};

export default SlideOver;
