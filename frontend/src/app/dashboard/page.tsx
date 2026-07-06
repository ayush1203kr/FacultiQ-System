"use client";

import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Plane,
  TrendingUp,
  Award,
  GraduationCap,
  Percent,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <DashboardLayout>
        <h2 className="text-xl">Loading...</h2>
      </DashboardLayout>
    );
  }

  const largestDepartment =
    data?.byDepartment.reduce(
      (a: any, b: any) =>
        a.count > b.count ? a : b,
      data.byDepartment[0]
    )?.department ?? "-";

  const topQualification =
    data?.qualificationDistribution.reduce(
      (a: any, b: any) =>
        a.count > b.count ? a : b,
      data.qualificationDistribution[0]
    )?.qualification ?? "-";

  const activeRatio =
    data?.totals.faculty === 0
      ? 0
      : Math.round(
          (data.totals.active /
            data.totals.faculty) *
            100
        );

  const newThisMonth =
    data?.monthlyJoinees[
      data.monthlyJoinees.length - 1
    ]?.count ?? 0;

  return (
    <DashboardLayout>
      <div className="relative space-y-10">

        {/* Graduation Cap Watermark */}
        <GraduationCap
          size={430}
          className="pointer-events-none absolute left-1/2 top-[160px] -translate-x-1/2 text-blue-300 opacity-10"
        />

        {/* Dashboard Heading */}

        <div className="relative z-10 flex items-center gap-3">

          <LayoutDashboard
            size={30}
            className="text-blue-600"
          />

          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

        </div>

        {/* Dashboard Cards */}

        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

          <Card
            icon={<Users size={22} />}
            title="Total Faculty"
            value={data?.totals.faculty ?? 0}
          />

          <Card
            icon={<Building2 size={22} />}
            title="Departments"
            value={
              data?.totals.departments ?? 0
            }
          />

          <Card
            icon={<UserCheck size={22} />}
            title="Active Faculty"
            value={data?.totals.active ?? 0}
          />

          <Card
            icon={<Plane size={22} />}
            title="On Leave"
            value={data?.totals.onLeave ?? 0}
          />

        </div>

        {/* Quick Insights */}

        <div className="relative z-10">

          <div className="mb-6 mt-2 flex items-center gap-3">
  <BarChart3
    size={30}
    className="text-blue-600"
  />

  <h2 className="text-3xl font-bold text-slate-900">
    Quick Insights
  </h2>
</div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <InsightCard
              icon={<TrendingUp size={20} />}
              title="Faculty Added This Month"
              value={newThisMonth}
            />
                        <InsightCard
              icon={<Award size={20} />}
              title="Largest Department"
              value={largestDepartment}
            />

            <InsightCard
              icon={<GraduationCap size={20} />}
              title="Top Qualification"
              value={topQualification}
            />

            <InsightCard
              icon={<Percent size={20} />}
              title="Active Ratio"
              value={`${activeRatio}%`}
            />

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

function Card({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-base font-semibold text-slate-700">
          {title}
        </h2>

        <div className="text-blue-600">
          {icon}
        </div>

      </div>

      <p className="mt-2 text-[34px] font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          {title}
        </span>

        <div className="text-blue-600">
          {icon}
        </div>
      </div>

     <p className="text-[28px] font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}