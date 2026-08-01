import { Link } from '@inertiajs/react';
import { Lock, User } from 'lucide-react';

export default function Setting() {
    return (
        <div>
            <div className="min-h-scree">
                <div className="mb-8 flex items-center space-x-4 bg-white p-4 shadow-lg">
                    <button className="text-gray-800" onClick={() => window.history.back()}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Settings</h1>
                </div>
                <div className="flex flex-col space-y-4">
                    {/* Profile */}
                    <Link href={route('profile.settings.edit-profile')}>
                        <button className="flex w-full items-center justify-between rounded-2xl bg-white p-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <User width={24} height={24} className="text-gray-600" />
                                </div>
                                <span className="text-lg font-medium text-gray-800">Edit Profile</span>
                            </div>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </Link>
                    {/* Password */}
                    <Link href={route('profile.settings.edit-password')}>
                        <button className="flex w-full items-center justify-between rounded-2xl bg-white p-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-8 w-8 items-center justify-center">
                                    <Lock width={24} height={24} className="text-gray-600" />
                                </div>
                                <span className="text-lg font-medium text-gray-800">Edit Password</span>
                            </div>
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
