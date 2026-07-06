"use client";

import { useState } from "react";

import Dialog from "@/components/ui/dialog";
import DepartmentForm from "./department-form";

interface Props {
  open: boolean;
  title: string;
  initial?: any;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function DepartmentDialog({
  open,
  title,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: any) {
    try {
      setLoading(true);

      await onSubmit(data);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      title={title}
      onClose={() => {
        if (!loading) onClose();
      }}
    >
      <DepartmentForm
        initial={initial}
        onSubmit={handleSubmit}
      />

      {loading && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Saving...
        </p>
      )}
    </Dialog>
  );
}