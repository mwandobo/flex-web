import { useRef, useEffect } from 'react';

interface Props {
    name: string,
    toggleOpen: () => void,
    isOpen?: boolean,
    children: React.ReactNode
}

const DropdownComponent = ({ name, toggleOpen, isOpen , children}: Props) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            if (isOpen) {
                toggleOpen(); // Close dropdown if it's open and user clicks outside
            }
        }
    };

    useEffect(() => {
        // Add event listener to detect clicks outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // Re-run effect if isOpen changes

    return (
        <div ref={dropdownRef}>
            {isOpen && (
                <div className="absolute right-4 top-16 w-80 min-h-80 bg-gray-200 border border-gray-300 rounded-md shadow-lg py-2 z-20 p-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DropdownComponent;
