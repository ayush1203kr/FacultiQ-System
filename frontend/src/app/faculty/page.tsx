"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import FacultyTable from "@/components/faculty/faculty-table";
import FacultyDialog from "@/components/faculty/faculty-dialog";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";

import { useFaculty } from "@/hooks/useFaculty";
import {
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "@/lib/faculty";

export default function FacultyPage() {
  const {
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

    reload,
  } = useFaculty();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Faculty Management
          </h1>

          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Add Faculty
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <Input
            placeholder="Search faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </Select>

          <Input
            placeholder="Department Id"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          />

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <FacultyTable
            faculty={faculty}
            onEdit={(f) => {
              setEditing(f);
              setOpen(true);
            }}
            onDelete={async (f) => {
              if (
                confirm(
                  `Delete ${f.firstName} ${f.lastName}?`
                )
              ) {
                await deleteFaculty(f.id);
                reload();
              }
            }}
          />
        )}

        <div className="flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Total Faculty : {total}
          </p>

          <div className="flex items-center gap-2">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <span>
              {page} / {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>

          </div>

        </div>

      </div>

      <FacultyDialog
        open={open}
        title={
          editing
            ? "Edit Faculty"
            : "Add Faculty"
        }
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSubmit={async (data) => {
          if (editing) {
            await updateFaculty(editing.id, data);
          } else {
            await createFaculty(data);
          }

          await reload();
        }}
      />

    </DashboardLayout>
  );
}