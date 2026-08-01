import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/pwa/types';
import { useEffect, useState } from 'react';

export default function Splashscreen() {
    const [currentDot, setCurrentDot] = useState(0);
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDot((prev) => (prev + 1) % 7);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (auth.user) {
            window.location.href = route('home');
        }
    }, [auth.user]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-600 relative overflow-hidden flex flex-col">
            {/* Background Decorative Circles */}
            {/* Top Left Circle */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-orange-300 relative">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300 to-red-300 rounded-full"></div>
                </div>
            </div>

            {/* Bottom Right Circle */}
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-tl from-yellow-300 to-orange-300 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-300 to-red-300 rounded-full"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-8">
                {/* Logo Container */}
                <div className="relative">
                    {/* White Circle Background */}
                    <div className="w-80 h-80 bg-white rounded-full shadow-2xl flex items-center justify-center">
                        <div className="text-center">
                            {/* Logo Text */}
                            <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                elabcare
                            </h1>

                            {/* Subtitle */}
                            <p className="text-gray-600 text-sm tracking-widest uppercase">
                                Advanced Medical Analysis
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Dots */}
            <div className="pb-12 flex justify-center">
                <div className="flex space-x-2">
                    {[...Array(7)].map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentDot
                                ? 'bg-white scale-125'
                                : 'bg-white/50'
                                }`}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="w-full px-8 pb-8 text-center text-white z-50">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                    Advanced Medical Analysis
                </h1>
                <p className="text-lg opacity-90 mb-8 leading-relaxed">
                    elabcare provides advanced medical analysis tools to help you
                    understand your health better.
                </p>

                {/* Get Started Button */}
                <Link href={route('login')} className="block w-full shadow bg-white text-gray-800 py-4  rounded-2xl text-xl font-semibold hover:bg-gray-100 transition-colors">
                    Get Started
                </Link>
            </div>
        </div>
    );
}
