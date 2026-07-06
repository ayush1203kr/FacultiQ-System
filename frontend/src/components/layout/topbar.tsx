"use client";

import { CircleUserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      {/* Left */}
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold sm:text-xl">
          Faculty Management Portal
        </h2>

        <p className="text-xs text-gray-500 sm:text-sm">
          Welcome back!
        </p>
      </div>

      {/* Right */}
      <div className="ml-4 flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="font-medium">
            {user?.faculty
              ? `${user.faculty.firstName} ${user.faculty.lastName}`
              : user?.email}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm sm:h-11 sm:w-11">
          <CircleUserRound size={24} />
        </div>
      </div>
    </header>
  );
}