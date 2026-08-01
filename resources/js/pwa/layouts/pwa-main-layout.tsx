import { PropsWithChildren } from 'react';
import AppBarHome from '../components/shared/app-bar-home';
import BottomNavigation from '../components/shared/bottom-navigation';
import { UserType } from '../types/userType';

type PwaMainLayoutProps = PropsWithChildren<{
    user: UserType;
}>;

export default function PwaMainLayout({ children, user }: PwaMainLayoutProps) {
    return (
        <>
            <AppBarHome user={user} />
            <div className="bg-white px-4 py-4">{children}</div>

            <BottomNavigation />
        </>
    );
}
