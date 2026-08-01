import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

const AppBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div
            className={`sticky top-0 z-50 -mx-4 mb-6 flex h-17 items-center justify-between bg-gray-50 px-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm' : 'pt-6 pb-3'}`}
        >
            <img src="/images/logo.png" alt="App Logo" className="h-8 w-auto" />

            <div className="flex items-center space-x-4">
                <button className="text-gray-600">
                    <Bell className="h-6 w-6" strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default AppBar;
