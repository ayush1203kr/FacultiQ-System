"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import AnalyticsCards from "@/components/analytics/analytics-cards";
import DepartmentChart from "@/components/analytics/department-chart";
import QualificationChart from "@/components/analytics/qualification-chart";
import MonthlyChart from "@/components/analytics/monthly-chart";

import { useDashboard } from "@/hooks/useDashboard";

export default function AnalyticsPage() {
  const { data, loading } = useDashboard();

  if (loading || !data) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">

        <h1 className="text-3xl font-bold">
          Analytics Dashboard
        </h1>

        <AnalyticsCards
          totals={data.totals}
        />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

          <DepartmentChart
            data={data.byDepartment}
          />

          <QualificationChart
            data={
              data.qualificationDistribution
            }
          />

        </div>

        <MonthlyChart
          data={data.monthlyJoinees}
        />

      </div>
    </DashboardLayout>
  );
}