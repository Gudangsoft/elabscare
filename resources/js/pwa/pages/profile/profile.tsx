import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { Link } from '@inertiajs/react';
import { Camera, Lock, User } from 'lucide-react';
import { useState } from 'react';

interface ProfileProps {
    user: UserType;
}
export default function Profile({ user }: ProfileProps) {
    const [activeTab, setActiveTab] = useState('Sleep Time');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    // const { auth } = usePage<SharedData>().props;

    return (
        <PwaMainLayout user={user}>
            <div className="">
                {/* Menu Items */}
                <div className="flex flex-col space-y-4">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="avatar"
                                // onChange={handleFileSelect}
                            />
                            <div className="relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-400 shadow-lg transition-shadow hover:shadow-xl">
                                {previewImage ? (
                                    <img src={previewImage} alt="Avatar Preview" className="h-full w-full object-cover" />
                                ) : user.avatar ? (
                                    <img src={`/storage/${user.avatar}`} alt="Current Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <Camera size={24} className="text-gray-600" />
                                )}
                            </div>
                        </div>
                        <h1 className="mt-2 text-lg font-semibold text-gray-800">{user.name}</h1>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    {/* Profile */}
                    <Link href={route('profile.settings.edit-profile')}>
                        <button className="flex w-full items-center justify-between rounded-2xl bg-gray-100 p-4">
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
                        <button className="flex w-full items-center justify-between rounded-2xl bg-gray-100 p-4">
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

                    {/* Logout */}
                    <Link method="post" href={route('logout')} className="flex w-full items-center justify-between rounded-2xl bg-gray-100 p-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-8 w-8 items-center justify-center">
                                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </div>
                            <span className="text-lg font-medium text-red-500">Logout</span>
                        </div>
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </PwaMainLayout>
    );
}
