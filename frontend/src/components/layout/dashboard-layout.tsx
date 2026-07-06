"use client";

import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          {children}
        </main>

        <footer className="py-4 text-center text-sm tracking-wide text-gray-400">
   © 2026 FacultiQ • Copyright © Ayush Kumar. All Rights Reserved.
</footer>
      </div>
    </div>
  );
}