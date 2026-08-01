"use client";

import React, { useState } from "react";
import { Home, Plus, User, History, PieChart } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";

export type ExploreModalItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
};

const navItems = [
  {
    label: "Home",
    href: "/home",
    icon: <Home strokeWidth={1.5} size={28} />,
  },
  {
    label: "Tren",
    href: "/trends",
    icon: <PieChart strokeWidth={1.5} size={28} />,
  },
  {
    label: "Tambah Pemeriksaan",
    href: "/examinations/add",
    icon: <Plus color="#ffffff" strokeWidth={3} size={19.7} />,
    isCenterButton: true,
  },
  {
    label: "Riwayat",
    href: "/history",
    icon: <History strokeWidth={1.5} size={28} />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User strokeWidth={1.5} size={28} />,
  },
];

const BottomNavigation = () => {
  const { url } = usePage();
  const [showExploreModal, setShowExploreModal] = useState(false);

  // Helper function untuk check apakah route aktif
  const isActiveRoute = (itemHref: string, currentUrl: string) => {
    // Hapus query parameters dari current URL
    const currentPath = currentUrl.split('?')[0];
    
    // Exact match untuk home page
    if (itemHref === '/' && currentPath === '/') {
      return true;
    }
    
    // Untuk route lain, check apakah current path starts with item href
    if (itemHref !== '/' && currentPath.startsWith(itemHref)) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      <nav
        className="fixed h-20 bottom-0 left-0 right-0 bg-white text-black border-t border-gray-200 flex justify-between items-center p-4 z-50"
        role="navigation"
        aria-label="Bottom Navigation"
      >
        {navItems.map((item, index) =>
          item.isCenterButton ? (
            <div
              key={index}
              className="w-1/5 flex flex-col items-center justify-center relative cursor-pointer"
              tabIndex={0}
              aria-label={item.label}
              onClick={() => router.visit(item.href)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setShowExploreModal(true);
              }}
            >
              <div className={`
                rounded-full bg-gradient-to-br from-teal-400 to-teal-600  flex items-center justify-center transition-all
                ${showExploreModal ? "scale-110" : "scale-100"}
                w-15 h-15 -mt-8 border-primary-white
              `}>
                {item.icon}
              </div>
              <span className={`text-xs mt-1 text-center ${isActiveRoute(item.href, url) ? "font-medium text-secondary" : "font-normal text-secondary-500"}`}>
                {item.label}
              </span>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`w-1/5 flex flex-col items-center justify-center ${isActiveRoute(item.href, url) ? "text-secondary" : "text-secondary-500"}`}
              aria-current={isActiveRoute(item.href, url) ? "page" : undefined}
              aria-label={item.label}
            >
              <div className="flex justify-center w-full">{item.icon}</div>
              <span className={`text-xs mt-1 ${isActiveRoute(item.href, url) ? "font-medium" : "font-normal"}`}>
                {item.label}
              </span>
            </Link>
          )
        )}
      </nav>
    </>
  );
};

export default BottomNavigation;