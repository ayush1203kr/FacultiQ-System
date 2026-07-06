"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface Faculty {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  qualification: string;
  experienceYears: number;
  status: string;
  departmentId: string;

  department: {
    id: string;
    name: string;
    code: string;
  };
}

interface FacultyResponse {
  data: Faculty[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  async function load() {
    setLoading(true);

    try {
      const res = await api.get<FacultyResponse>("/faculty", {
        params: {
          page,
          limit,
          search: search || undefined,
          status: status || undefined,
          department: department || undefined,
        },
      });

      setFaculty(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, search, status, department]);

  return {
    faculty,
    loading,

    search,
    setSearch,

    status,
    setStatus,

    department,
    setDepartment,

    page,
    setPage,

    total,
    totalPages,

    reload: load,
  };
}