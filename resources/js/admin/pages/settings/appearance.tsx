import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/pwa/components/appearance-tabs';
import HeadingSmall from '@/pwa/components/heading-small';
import { type BreadcrumbItem } from '@/pwa/types';

import AppLayout from '@/pwa/layouts/app-layout';
import SettingsLayout from '@/pwa/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
