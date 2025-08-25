"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ChartColumn, ChevronDown, ChevronUp, LayoutDashboard, LogOut, UserRoundPen, UsersRound, Utensils } from "lucide-react";

	const Sidebar = () => {
  const pathname = usePathname(); // Get the current path
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCanteensMenu, setOpenCanteensMenu] = useState(false);

  useEffect(() => {
    // Automatically open the "User" menu if the path matches any "User" submenu
    if (pathname.startsWith("/admindashboard/User")) {
      setOpenUserMenu(true);
    }

    // Automatically open the "Canteens" menu if the path matches any "Canteens" submenu
    if (pathname.startsWith("/admindashboard/Canteens")) {
      setOpenCanteensMenu(true);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path) => pathname === path;
  const [openMenu, setOpenMenu] = useState(null);

const links = [
  { href: "/admindashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  {
    label: "Canteens",
    icon: <Utensils />,
    matchPath: "/admindashboard/Canteens",
    subMenu: [
      { href: "/admindashboard/Canteens/AllCanteens", label: "All Canteens" },
      { href: "/admindashboard/Canteens/AddNew", label: "Add New" }
    ]
  },
  {
    label: "Users",
    icon: <UsersRound />,
    matchPath: "/admindashboard/User",
    subMenu: [
      { href: "/admindashboard/User/Owner", label: "Owner" },
      { href: "/admindashboard/User/Student", label: "Student" },
      { href: "/admindashboard/User/Cashier", label: "Cashier" },
      { href: "/admindashboard/User/Admin", label: "Admin" }
      
    ]
  },
  
  { href: "/admindashboard/Profile", label: "Profile", icon: <UserRoundPen /> }
];

return (
  <div className="w-20 h-[100vh] p-4 text-gray-300 bg-[#2B2623] md:w-60">
    <h1 className="mb-10 hidden md:block text-center text-2xl font-bold text-[#ff842f]">MealMate</h1>
    <ul className="space-y-4">
      {links.map((link) => {
        if (link.subMenu) {
          return (
            <li key={link.label} className="relative">
              
 <button
  onClick={() => setOpenMenu(openMenu === link.label ? null : link.label)}
  className={`flex justify-between items-center gap-3 p-2 w-full rounded hover:bg-[#3d3632] hover:text-orange-500 ${
    pathname.startsWith(link.matchPath || "") ? "text-orange-500 font-bold" : ""
  }`}
>



                <span className="flex gap-2">
                  {link.icon}
                  <span className="hidden md:flex">{link.label}</span>
                </span>
                
                <span>{openMenu === link.label ? <ChevronUp className="hidden md:flex"/> : <ChevronDown className="hidden md:flex"/>  }</span>
              </button>
              {/* Submenu for larger screens */}
              {openMenu === link.label && (
                <ul className="hidden mt-1 ml-4 space-y-2 md:block">
                  {link.subMenu.map((subLink) => (
                    <li key={subLink.href}>
                      <Link
  href={subLink.href}
  className="block p-2 rounded hover:bg-[#3d3632] hover:text-orange-500"
>
  {subLink.label}
</Link>

                    </li>
                  ))}
                </ul>
              )}
              {/* Floating submenu for small screens */}
              {openMenu === link.label && (
                <div className="absolute left-full top-0 mt-2 w-48 bg-[#2B2623]  shadow-lg rounded md:hidden">
                  <ul className="p-2">
                    {link.subMenu.map((subLink) => (
                      <li key={subLink.href}>
                        <Link
                          href={subLink.href}
                          className="block p-2 rounded hover:bg-[#3d3632] hover:text-orange-500"
                        >
                          {subLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        }
        return (
<li key={link.href || link.label}>
  <Link
    href={link.href}
    className={`gap-3 flex p-2 rounded hover:bg-[#3d3632] hover:text-orange-500 ${
      (link.matchPath && pathname.startsWith(link.matchPath)) || pathname === link.href
        ? "text-orange-500 font-bold"
        : ""
    }`}
  >
    <span>{link.icon}</span>
    <span className="hidden md:flex">{link.label}</span>
  </Link>
</li>


        );
      })}
      <li>
        <button
          onClick={handleSignOut}
          className="flex w-full gap-3 p-2 rounded hover:bg-[#3d3632] hover:text-orange-500"
        >
          <LogOut />
          <span className="hidden md:flex">Logout</span>
        </button>
      </li>
    </ul>
  </div>
);

};

export default Sidebar;
