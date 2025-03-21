import { CircleUserRound} from 'lucide-react';
import {useState, useRef, useEffect, useMemo} from 'react';
import {useRouter} from "next/navigation";

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
    const router = useRouter()


    // Toggle dropdown open/close
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    const onclick = (path) => {
            router.push(path)
    }

    const iconSize = useMemo(() => window.innerWidth >= 768 ? 15 : 30, []);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
            >
                <div className={'flex flex-col items-center'}>
                    <CircleUserRound size={15} className="text-gray-500 hidden md:block" />
                    <CircleUserRound size={30} className="text-gray-500 md:hidden" />
                    <span className="text-xs hidden md:block font-medium text-gray-500">{name}</span>
                </div>

            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => onclick('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => onclick('settings')}
                    >
                        Settings
                    </button>
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
