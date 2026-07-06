"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";

import DepartmentTable from "@/components/department/department-table";
import DepartmentDialog from "@/components/department/department-dialog";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { useDepartment } from "@/hooks/useDepartment";

import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/department";

export default function DepartmentsPage() {
  const {
    departments,
    loading,

    search,
    setSearch,

    page,
    setPage,

    total,
    totalPages,

    reload,
  } = useDepartment();

  const [open, setOpen] = useState(false);

  const [editing, setEditing] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <h1 className="text-3xl font-bold">
            Department Management
          </h1>

          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Department
          </Button>

        </div>

        <Input
          placeholder="Search Department..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DepartmentTable
            departments={departments}
            onEdit={(dept) => {
              setEditing(dept);
              setOpen(true);
            }}
            onDelete={async (dept) => {
              if (
                confirm(
                  `Delete ${dept.name}?`
                )
              ) {
                await deleteDepartment(
                  dept.id
                );

                await reload();
              }
            }}
          />
        )}

        <div className="flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Total Departments : {total}
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

      <DepartmentDialog
        open={open}
        title={
          editing
            ? "Edit Department"
            : "Add Department"
        }
        initial={editing}
        onClose={() => {
          setEditing(null);
          setOpen(false);
        }}
        onSubmit={async (data) => {
          if (editing) {
            await updateDepartment(
              editing.id,
              data
            );
          } else {
            await createDepartment(
              data
            );
          }

          await reload();
        }}
      />

    </DashboardLayout>
  );
}