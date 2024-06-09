import { CheckCircle2, X } from 'lucide-react';
import React, { ReactNode } from 'react';
import { ReusableButton } from '../button/reusable-button';

interface Props {
    isOpen: boolean
    onClose: () => void
    onSaveButtonName: string
    title: string
    children: ReactNode
    isDisabled?: boolean
}

const PopupModal = ({
    isOpen,
    onClose,
    children,
    title,
    onSaveButtonName,
    isDisabled
}: Props) => {

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-white">
                    {!isDisabled && <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                    </button>}
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-md90 font-medium text-gray-900 dark:text-gray-900">{title}</h3>

                        {children}


                        {/* <form className="space-y-6" action="#">

                            <div className="flex justify-end">
                                <ReusableButton
                                    name={onSaveButtonName}
                                    onClick={onSave}
                                    isDisabled={isDisabled}
                                >
                                    {!isDisabled && <CheckCircle2 size={13} />}
                                </ReusableButton>
                            </div>
                        </form> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupModal;