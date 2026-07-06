"use client";

import { useEffect, useState } from "react";
import { getActivity } from "@/lib/activity";

export interface Activity {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;

  metadata?: {
    name?: string;
    email?: string;
    employeeId?: string;
    department?: string;
    code?: string;
    changed?: string[];
  };

  actor: {
    email: string;
  };
}

interface ActivityResponse {
  data: Activity[];
  total: number;
  page: number;
  totalPages: number;
}

export function useActivity() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  async function load() {
    setLoading(true);

    try {
      const res: ActivityResponse = await getActivity({
        page,
      });

      setActivity(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page]);

  return {
    activity,
    loading,

    page,
    setPage,

    total,
    totalPages,

    reload: load,
  };
}