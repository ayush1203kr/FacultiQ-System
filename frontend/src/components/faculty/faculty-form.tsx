"use client";

import { useEffect, useState } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { api } from "@/lib/api";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Props {
  onSubmit: (data: any) => void;
  initial?: any;
}

export default function FacultyForm({
  onSubmit,
  initial,
}: Props) {
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    designation: initial?.designation ?? "",

    qualification: initial?.qualification ?? "BTECH",

    experienceYears: initial?.experienceYears ?? 0,

    departmentId: initial?.departmentId ?? "",

    joiningDate:
      initial?.joiningDate?.substring(0, 10) ??
      new Date().toISOString().substring(0, 10),

    status: initial?.status ?? "ACTIVE",

    subjects: initial?.subjects?.join(", ") ?? "",

    bio: initial?.bio ?? "",

    createLoginAccount: false,

    password: "",
  });

  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDepartments();
  }, []);

  function change(key: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

       console.log("Submitting form:", form);

onSubmit({
  ...form,
  joiningDate: new Date(form.joiningDate).toISOString(),
  subjects: form.subjects
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean),
});
      }}
    >
      <div className="grid grid-cols-2 gap-4">

        <Input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) =>
            change("firstName", e.target.value)
          }
        />

        <Input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) =>
            change("lastName", e.target.value)
          }
        />

      </div>

      <Input
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          change("email", e.target.value)
        }
      />

      <Input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) =>
          change("phone", e.target.value)
        }
      />

      <Input
        placeholder="Designation"
        value={form.designation}
        onChange={(e) =>
          change("designation", e.target.value)
        }
      />

      <Select
        value={form.departmentId}
        onChange={(e) =>
          change("departmentId", e.target.value)
        }
      >
        <option value="">
          Select Department
        </option>

        {departments.map((dept) => (
          <option
            key={dept.id}
            value={dept.id}
          >
            {dept.name}
          </option>
        ))}
      </Select>

      <Select
        value={form.qualification}
        onChange={(e) =>
          change("qualification", e.target.value)
        }
      >
        <option value="BTECH">BTECH</option>
        <option value="MTECH">MTECH</option>
        <option value="PHD">PHD</option>
      </Select>

      <Input
        type="number"
        placeholder="Experience (Years)"
        value={form.experienceYears}
        onChange={(e) =>
          change(
            "experienceYears",
            Number(e.target.value)
          )
        }
      />

      <Input
        type="date"
        value={form.joiningDate}
        onChange={(e) =>
          change("joiningDate", e.target.value)
        }
      />

      <Input
        placeholder="Subjects (comma separated)"
        value={form.subjects}
        onChange={(e) =>
          change("subjects", e.target.value)
        }
      />

      <textarea
        className="w-full rounded-lg border border-gray-300 p-3"
        rows={4}
        placeholder="Faculty Bio"
        value={form.bio}
        onChange={(e) =>
          change("bio", e.target.value)
        }
      />

      <Select
        value={form.status}
        onChange={(e) =>
          change("status", e.target.value)
        }
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="ON_LEAVE">ON_LEAVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </Select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.createLoginAccount}
          onChange={(e) =>
            change(
              "createLoginAccount",
              e.target.checked
            )
          }
        />

        Create Login Account
      </label>

      {form.createLoginAccount && (
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            change("password", e.target.value)
          }
        />
      )}

      <Button
        type="submit"
        className="w-full"
      >
        {initial
          ? "Update Faculty"
          : "Create Faculty"}
      </Button>
    </form>
  );
}