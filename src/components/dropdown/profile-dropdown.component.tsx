import {Bell, CircleUserRound} from 'lucide-react';
import {useState, useRef, useEffect} from 'react';

interface Props {
    name: string,
    handleLogout: () => void
}

const ProfileDropdown = ({
                             name,
                             handleLogout
                         }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown open/close
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex gap-4" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => console.log('hi')}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <Bell className={'text-gray-500'}/>
            </button>

            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <div className={'flex flex-col items-center'}>
                    <CircleUserRound size={15} className={'text-gray-500'}/>
                    <span className="text-xs font-medium text-gray-500">{name}</span>
                </div>

            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    <a
                        // href="/profile"
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profile
                    </a>
                    <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Settings
                    </a>
                    <button
                        onClick={handleLogout} // Handle Logout Logic
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
