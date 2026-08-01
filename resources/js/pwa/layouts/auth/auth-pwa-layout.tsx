import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthPwaLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { url } = usePage();
    const { app_logo } = usePage().props;

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600">
            {/* Background Decorative Circles */}
            {/* Top Left Circle */}
            <div className="absolute -top-32 -left-32 h-80 w-80 overflow-hidden rounded-full">
                <div className="relative h-full w-full bg-gradient-to-br from-yellow-300 to-orange-300">
                    <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-gradient-to-br from-pink-300 to-red-300"></div>
                </div>
            </div>

            {/* Bottom Right Circle */}
            <div className="absolute -right-32 -bottom-32 h-80 w-80 overflow-hidden rounded-full">
                <div className="relative h-full w-full bg-gradient-to-tl from-yellow-300 to-orange-300">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-tl from-pink-300 to-red-300"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center px-8 py-6">
                {/* Logo Container */}
                <div className="relative">
                    {/* White Circle Background */}
                    <div className="flex w-full max-w-sm flex-col gap-8 rounded-xl bg-white p-8 shadow-md">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex flex-row items-center gap-2">
                                    {url !== '/login' && (
                                        <div className="absolute left-4 z-20">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
                                                aria-label="Back"
                                            >
                                                <ChevronLeft className="h-5 w-5 text-gray-700" />
                                            </button>
                                        </div>
                                    )}
                                    <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                        <img src={`/storage/${app_logo}`} alt="elabcare logo" className="h-8 w-auto" />
                                        <span className="sr-only">{title}</span>
                                    </Link>
                                </div>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium text-gray-800">{title}</h1>
                                    <p className="text-center text-sm text-gray-800">{description}</p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
