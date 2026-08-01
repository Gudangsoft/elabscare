import { UserType } from '@/pwa/types/userType';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, router, usePage } from '@inertiajs/react';
import { HeartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ThemeToggleButton from '../helper/ThemeToggleButton';

interface MasterLayoutProps {
    user: UserType;
    children: React.ReactNode;
}

const MasterLayout: React.FC<MasterLayoutProps> = ({ children, user }) => {
    const [sidebarActive, setSidebarActive] = useState<boolean>(false);
    const [mobileMenu, setMobileMenu] = useState<boolean>(false);
    // const location = useLocation();

    const { url } = usePage();

    useEffect(() => {
        console.log('user data');
        console.log(user);

        const handleDropdownClick = (event: MouseEvent) => {
            event.preventDefault();
            const clickedLink = event.currentTarget as HTMLElement;
            const clickedDropdown = clickedLink.closest('.dropdown');
            if (!clickedDropdown) return;

            const isActive = clickedDropdown.classList.contains('open');
            const allDropdowns = document.querySelectorAll('.sidebar-menu .dropdown');
            allDropdowns.forEach((dropdown) => {
                dropdown.classList.remove('open');
                const submenu = dropdown.querySelector('.sidebar-submenu') as HTMLElement;
                if (submenu) submenu.style.maxHeight = '0px';
            });

            if (!isActive) {
                clickedDropdown.classList.add('open');
                const submenu = clickedDropdown.querySelector('.sidebar-submenu') as HTMLElement;
                if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            }
        };

        const dropdownTriggers = document.querySelectorAll<HTMLAnchorElement>('.sidebar-menu .dropdown > a');
        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener('click', handleDropdownClick);
        });

        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll('.sidebar-menu .dropdown');
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll<HTMLAnchorElement>('.sidebar-submenu li a');
                submenuLinks.forEach((link) => {
                    if (link.getAttribute('href') === location.pathname || link.getAttribute('to') === location.pathname) {
                        dropdown.classList.add('open');
                        const submenu = dropdown.querySelector('.sidebar-submenu') as HTMLElement;
                        if (submenu) submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                    }
                });
            });
        };

        openActiveDropdown();

        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener('click', handleDropdownClick);
            });
        };
    }, []);

    const sidebarControl = () => {
        setSidebarActive(!sidebarActive);
    };

    const mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };

    const logout = () => {
        router.post(route('logout'));
        window.location.href = route('login');
    };

    const { app_logo } = usePage().props;

    return (
        <section className={mobileMenu ? 'overlay active' : 'overlay'}>
            {/* sidebar */}
            <aside className={sidebarActive ? 'sidebar active' : mobileMenu ? 'sidebar sidebar-open' : 'sidebar'}>
                <button onClick={mobileMenuControl} type="button" className="sidebar-close-btn">
                    <Icon icon="radix-icons:cross-2" />
                </button>
                <div className="bg-white">
                    <Link href="/" className="sidebar-logo">
                        <img src={`/storage/${app_logo}`} alt="site logo" className="light-logo" />
                    </Link>
                </div>
                <div className="sidebar-menu-area">
                    <ul className="sidebar-menu" id="sidebar-menu">
                        <li>
                            <Link href="/admin" className={url === '/admin' ? 'active-page' : ''}>
                                <Icon icon="solar:home-smile-angle-outline" className="menu-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/users" className={url === '/admin/users' ? 'active-page' : ''}>
                                <Icon icon="mage:user" className="menu-icon" />
                                <span>Users</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/banner-images" className={url === '/admin/banner-images' ? 'active-page' : ''}>
                                <Icon icon="mage:image" className="menu-icon" />
                                <span>Banner Images</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/health-records" className={url === '/admin/health-records' ? 'active-page' : ''}>
                                <Icon icon="mage:heart-health" className="menu-icon" />
                                <span>Health Records</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/obat" className={url === '/admin/obat' ? 'active-page' : ''}>
                                <Icon icon="mdi:pill" className="menu-icon" />
                                <span>Master Obat</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/terapi-obat" className={url === '/admin/terapi-obat' ? 'active-page' : ''}>
                                <Icon icon="mdi:clipboard-pulse-outline" className="menu-icon" />
                                <span>Terapi Pasien</span>
                            </Link>
                        </li>
                        <li className="dropdown">
                            <Link href="#">
                                <Icon icon="mage:settings" className="menu-icon" />
                                <span>Settings</span>
                            </Link>
                            <ul className="sidebar-submenu">
                                <li>
                                    <Link href="/admin/settings/app-logo" className={url === '/admin/settings/app-logo' ? 'active-page' : ''}>
                                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                                        App Logo
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/settings/privacy-policy"
                                        className={url === '/admin/settings/privacy-policy' ? 'active-page' : ''}
                                    >
                                        <i className="ri-circle-fill circle-icon text-warning-main w-auto" /> Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside>

            <main className={sidebarActive ? 'dashboard-main active' : 'dashboard-main'}>
                <div className="navbar-header">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-auto">
                            <div className="d-flex align-items-center flex-wrap gap-4">
                                <button type="button" className="sidebar-toggle" onClick={sidebarControl}>
                                    {sidebarActive ? (
                                        <Icon icon="iconoir:arrow-right" className="icon non-active text-2xl" />
                                    ) : (
                                        <Icon icon="heroicons:bars-3-solid" className="icon non-active text-2xl" />
                                    )}
                                </button>
                                <button onClick={mobileMenuControl} type="button" className="sidebar-mobile-toggle">
                                    <Icon icon="heroicons:bars-3-solid" className="icon" />
                                </button>
                                <form className="navbar-search">
                                    <input type="text" name="search" placeholder="Search" />
                                    <Icon icon="ion:search-outline" className="icon" />
                                </form>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center flex-wrap gap-3">
                                {/* ThemeToggleButton */}
                                <ThemeToggleButton />

                                {/* Notification dropdown end */}
                                <div className="dropdown">
                                    <button
                                        className="d-flex justify-content-center align-items-center rounded-circle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={`/storage/` + user.avatar}
                                                alt="avatar"
                                                className="rounded-circle h-8 w-8"
                                                style={{ objectFit: 'cover', height: '40px', width: '40px' }}
                                            />
                                        ) : (
                                            <img
                                                src="/assets/admin/images/avatar/default-avatar.png"
                                                alt="avatar"
                                                className="rounded-circle"
                                                style={{ objectFit: 'cover', height: '40px', width: '40px' }}
                                            />
                                        )}
                                    </button>
                                    <div className="dropdown-menu to-top dropdown-menu-sm">
                                        <div className="radius-8 bg-primary-50 d-flex align-items-center justify-content-between mb-16 gap-2 px-16 py-12">
                                            <div>
                                                <h6 className="text-primary-light fw-semibold mb-2 text-lg">{user.name}</h6>
                                                <span className="text-secondary-light fw-medium text-sm">{user.email}</span>
                                            </div>
                                            <button type="button" className="hover-text-danger">
                                                <Icon icon="radix-icons:cross-1" className="icon text-xl" />
                                            </button>
                                        </div>
                                        <ul className="to-top-list">
                                            <li>
                                                <Link
                                                    href="/admin/profile"
                                                    className="dropdown-item hover-bg-transparent hover-text-primary d-flex align-items-center gap-3 px-0 py-8 text-black"
                                                >
                                                    <Icon icon="lucide:user" className="icon text-xl" /> My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <div
                                                    onClick={logout}
                                                    className="dropdown-item hover-bg-transparent hover-text-danger d-flex align-items-center gap-3 px-0 py-8 text-black"
                                                >
                                                    <Icon icon="lucide:power" className="icon text-xl" /> Log Out
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Profile dropdown end */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* dashboard-main-body */}
                <div className="dashboard-main-body">{children}</div>

                {/* Footer section */}
                <footer className="d-footer">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-auto">
                            <p className="mb-0">{`©` + new Date().getFullYear() + ' eLabCare. All Rights Reserved.'}</p>
                        </div>
                        <div className="col-auto">
                            <p className="mb-0">
                                Made by <HeartIcon className="text-danger" />
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </section>
    );
};

export default MasterLayout;
