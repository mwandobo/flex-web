
const CircleCheckbox = ({ checked }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                className="hidden" // Hide the default checkbox
            />
            <div
                className={`flex items-center justify-center w-4 h-4 border-2 rounded-full transition duration-300 ${
                    checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                }`}
            >
                {checked && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                )}
            </div>
        </label>
    );
};

export default CircleCheckbox