import React, { ReactNode } from 'react';

interface Props {
    isOpen: boolean;
    size?: 'sm' | 'md' | 'lg';
    onClose: () => void;
    onSaveButtonName: string;
    title: string;
    children: ReactNode;
    isDisabled?: boolean;
}

const PopupModal = ({
                        isOpen,
                        onClose,
                        children,
                        title,
                        size = 'sm',
                        isDisabled,
                    }: Props) => {
    const sizeWidth = () => {
        switch (size) {
            case 'md':
                return 'w-full md:w-3/4';
            case 'lg':
                return 'w-full md:w-full';
            case 'sm':
            default:
                return 'w-full md:w-1/2';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className={`relative ${sizeWidth()} max-h-full py-4 px-4 md:px-6 overflow-y-auto`}>
                <div className="bg-white relative w-full rounded-lg shadow">
                    {!isDisabled && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3 right-3 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    )}

                    <div className="p-6">
                        <h3 className="text-md90 font-medium text-gray-900">{title}</h3>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;
