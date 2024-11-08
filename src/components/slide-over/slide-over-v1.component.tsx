interface SlideOverProps {
    title?: string;
    width?: string;
    isShowSlideOver?: boolean;
    isSubmitDisabled?: boolean;
    isClearDisabled?: boolean;
    children: React.ReactNode;
    onClose: () => void;
    onSubmit: () => void;
    onClear: () => void;
}

const SlideOverV1: React.FC<SlideOverProps> = ({
                                                   title = "Approval Trail",
                                                   width = "25%",
                                                   children,
                                                   isShowSlideOver,
                                                   onClose,
                                                   onSubmit,
                                                   onClear,
                                                   isSubmitDisabled,
                                                   isClearDisabled
                                               }) => {
    const toggleSlideOver = () => {
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 overflow-hidden transition-all ease-in-out duration-500 text-xs ${
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
                    className={`fixed right-8 p-4 rounded-md top-40 h-96 bg-white shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col ${
                        isShowSlideOver ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    style={{ width }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold">{title}</h2>
                        <button onClick={toggleSlideOver} className="text-gray-500 hover:text-gray-800">
                            ✕
                        </button>
                    </div>
                    <hr className="w-full border-gray-200 mb-2" />

                    {/* Content */}
                    <div className="overflow-y-auto flex-grow">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2">
                        <button
                            disabled={isClearDisabled}
                            onClick={onClear}
                            className="w-full py-2 rounded-md hover:bg-gray-50 shadow-md border border-gray-20 text-black"
                        >
                            Clear Filters
                        </button>
                        <button
                            disabled={isSubmitDisabled}
                            onClick={onSubmit}
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        >
                            Submit Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SlideOverV1;
