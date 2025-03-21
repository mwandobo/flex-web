interface SlideOverProps {
    title?: string;
    width?: string;
    isShowSlideOver?: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

const SlideOverV2: React.FC<SlideOverProps> = ({
                                                   title = "Approval Trail",
                                                   width = "25%",
                                                   children,
                                                   isShowSlideOver,
                                                   onClose,
                                               }) => {
    const toggleSlideOver = () => {
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 overflow-hidden transition-all ease-in-out duration-500 text-xs flex flex-col justify-center items-center ${
                    isShowSlideOver ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out ${
                        isShowSlideOver ? 'opacity-50' : 'opacity-0'
                    }`}
                    onClick={toggleSlideOver}
                />

                {/* Slide Over */}
                <div
                    className={`fixed right-0 top-0 bottom-0 p-4 rounded-md   bg-white shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col ${
                        isShowSlideOver ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ width }}
                >
                    {/* Header */}
                    <div className="flex justify-end  items-center mb-2">
                        <button onClick={toggleSlideOver} className="text-gray-500 hover:text-gray-800">
                            ✕
                        </button>
                    </div>
                    <hr className="w-full border-gray-200 mb-2" />

                    {/* Content */}
                    <div className="overflow-y-auto flex-grow">
                        {children}
                    </div>

                </div>
            </div>
        </>
    );
};

export default SlideOverV2;