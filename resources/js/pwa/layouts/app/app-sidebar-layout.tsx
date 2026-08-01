import { AppContent } from '@/pwa/components/app-content';
import { AppShell } from '@/pwa/components/app-shell';
import { AppSidebar } from '@/pwa/components/app-sidebar';
import { AppSidebarHeader } from '@/pwa/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/pwa/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
