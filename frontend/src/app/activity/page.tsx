"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import ActivityTable from "@/components/activity/activity-table";

import Button from "@/components/ui/button";

import { useActivity } from "@/hooks/useActivity";

export default function ActivityPage() {
  const {
    activity,
    loading,

    page,
    setPage,

    total,
    totalPages,
  } = useActivity();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Activity Logs
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ActivityTable activity={activity} />
        )}

        <div className="flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Total Logs : {total}
          </p>

          <div className="flex gap-2">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
            >
              Previous
            </Button>

            <span className="flex items-center px-3">
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(page + 1)
              }
            >
              Next
            </Button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}