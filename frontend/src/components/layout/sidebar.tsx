"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  History,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/faculty",
    label: "Faculty",
    icon: Users,
  },
  {
    href: "/departments",
    label: "Departments",
    icon: Building2,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/activity",
    label: "Activity",
    icon: History,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center justify-center border-b p-5">
        <Image
          src="/logo.png"
          alt="FacultiQ Logo"
          width={180}
          height={160}
          priority
          className="h-19 w-auto object-contain"
        />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}