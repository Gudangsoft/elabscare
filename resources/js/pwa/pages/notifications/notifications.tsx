import PwaMainLayout from '@/pwa/layouts/pwa-main-layout';
import { UserType } from '@/pwa/types/userType';
import { router } from '@inertiajs/react';
import { Bell, CheckCheck, Pill } from 'lucide-react';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    scheduled_at: string | null;
    created_at: string;
}

interface NotificationsPageProps {
    user: UserType;
    notifications: NotificationItem[];
}

export default function NotificationsPage({ user, notifications }: NotificationsPageProps) {
    const unreadCount = notifications.filter((item) => !item.is_read).length;

    const markAsRead = (id: number) => {
        router.patch(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.patch('/notifications/read-all', {}, { preserveScroll: true });
    };

    const formatDateTime = (value: string) =>
        new Date(value).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <PwaMainLayout user={user}>
            <div className="min-h-screen">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
                        <p className="mt-1 text-sm text-gray-600">{unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center space-x-1.5 rounded-full bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                        >
                            <CheckCheck className="h-4 w-4" />
                            <span>Tandai Semua</span>
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {notifications.length > 0 ? (
                        notifications.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => !item.is_read && markAsRead(item.id)}
                                className={`w-full rounded-2xl p-4 text-left shadow-sm transition-colors ${
                                    item.is_read ? 'bg-white' : 'bg-teal-50'
                                }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                                            item.is_read ? 'bg-gray-100' : 'bg-teal-100'
                                        }`}
                                    >
                                        {item.title.toLowerCase().includes('obat') ? (
                                            <Pill className={`h-5 w-5 ${item.is_read ? 'text-gray-500' : 'text-teal-600'}`} />
                                        ) : (
                                            <Bell className={`h-5 w-5 ${item.is_read ? 'text-gray-500' : 'text-teal-600'}`} />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className={`text-sm font-semibold ${item.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {item.title}
                                            </h3>
                                            {!item.is_read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-teal-500"></span>}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{item.message}</p>
                                        <p className="mt-2 text-xs text-gray-400">{formatDateTime(item.created_at)}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="rounded-2xl bg-white p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Bell className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-800">Belum Ada Notifikasi</h3>
                            <p className="text-gray-600">Notifikasi dan pengingat obat akan muncul di sini</p>
                        </div>
                    )}
                </div>

                <div className="h-24"></div>
            </div>
        </PwaMainLayout>
    );
}
