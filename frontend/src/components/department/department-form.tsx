"use client";

import { useState } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface Props {
  initial?: any;
  onSubmit: (data: any) => void;
}

export default function DepartmentForm({
  initial,
  onSubmit,
}: Props) {
  const [name, setName] = useState(
    initial?.name ?? ""
  );

  const [code, setCode] = useState(
    initial?.code ?? ""
  );

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          name,
          code,
        });
      }}
    >
      <Input
        placeholder="Department Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <Input
        placeholder="Department Code"
        value={code}
        onChange={(e) =>
          setCode(e.target.value.toUpperCase())
        }
      />

      <Button
        type="submit"
        className="w-full"
      >
        {initial
          ? "Update Department"
          : "Create Department"}
      </Button>
    </form>
  );
}