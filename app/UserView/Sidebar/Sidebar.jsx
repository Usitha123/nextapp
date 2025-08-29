"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BoxIcon, LayoutDashboardIcon, LayoutGrid, LogOut, UserRound, Utensils, Menu, X } from 'lucide-react';
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/UserView", label: "Dashboard", icon: <LayoutDashboardIcon /> },
    { href: "/UserView/Canteens", label: "Canteens", icon: <Utensils /> },
    { href: "/UserView/Orders/Ongoing", label: "Orders", icon: <BoxIcon /> },
    { href: "/UserView/Profile", label: "Profile", icon: <UserRound /> },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow-md md:hidden">
        <h1 className="text-xl font-bold text-[#ff842f]">Meal Mate</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-[#ff842f] focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-60 fixed left-0 top-0 z-40 min-h-screen p-4 text-black bg-white flex-col">
        <h1 className="mb-10 text-center text-2xl font-bold text-[#ff842f]">Meal Mate</h1>
        <nav className="flex-1">
          <ul className="space-y-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`gap-3 flex p-3 rounded-lg transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500 ${
                      isActive ? "text-orange-500 font-bold bg-orange-50" : "text-black"
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          onClick={handleSignOut}
          className="flex w-full gap-3 p-3 mt-4 text-black rounded-lg transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-xl font-bold text-[#ff842f]">Meal Mate</h1>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`gap-3 flex p-3 rounded-lg transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500 ${
                        isActive ? "text-orange-500 font-bold bg-orange-50" : "text-black"
                      }`}
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Logout Button */}
          <button
            onClick={handleSignOut}
            className="flex w-full gap-3 p-3 mt-4 text-black rounded-lg transition-colors duration-200 hover:bg-orange-50 hover:text-orange-500 border-t border-gray-200"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;