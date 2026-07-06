"use client";

import Button from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Department } from "@/hooks/useDepartment";

interface Props {
  departments: Department[];
  onEdit?: (department: Department) => void;
  onDelete?: (department: Department) => void;
}

export default function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Faculty</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {departments.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell>{dept.name}</TableCell>

            <TableCell>{dept.code}</TableCell>

            <TableCell>
              {dept._count.faculty}
            </TableCell>

            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onEdit?.(dept)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => onDelete?.(dept)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}