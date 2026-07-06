"use client";

import { useEffect, useState } from "react";
import { getDepartments } from "@/lib/department";

export interface Department {
  id: string;
  name: string;
  code: string;
  _count: {
    faculty: number;
  };
}

interface DepartmentResponse {
  data: Department[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  async function load() {
    setLoading(true);

    try {
      const res: DepartmentResponse = await getDepartments({
        page,
        limit: 10,
        search: search || undefined,
      });

      setDepartments(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, search]);

  return {
    departments,
    loading,

    search,
    setSearch,

    page,
    setPage,

    total,
    totalPages,

    reload: load,
  };
}