import { AppContent } from '@/pwa/components/app-content';
import { AppHeader } from '@/pwa/components/app-header';
import { AppShell } from '@/pwa/components/app-shell';
import { type BreadcrumbItem } from '@/pwa/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
