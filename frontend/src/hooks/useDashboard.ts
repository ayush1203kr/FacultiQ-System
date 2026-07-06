"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface DashboardSummary {
  totals: {
    faculty: number;
    departments: number;
    active: number;
    onLeave: number;
    inactive: number;
  };

  byDepartment: any[];
  statusDistribution: any[];
  qualificationDistribution: any[];
  monthlyJoinees: any[];
}

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await api.get("/analytics/summary");
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    data,
    loading,
    reload: load,
  };
}