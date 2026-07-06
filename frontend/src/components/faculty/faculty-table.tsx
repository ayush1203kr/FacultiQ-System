"use client";

import Button from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Faculty } from "@/hooks/useFaculty";

interface Props {
  faculty: Faculty[];
  onEdit?: (faculty: Faculty) => void;
  onDelete?: (faculty: Faculty) => void;
}

export default function FacultyTable({
  faculty,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Qualification</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {faculty.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.employeeId}</TableCell>

            <TableCell>
              {item.firstName} {item.lastName}
            </TableCell>

            <TableCell>
              {item.department.name}
            </TableCell>

            <TableCell>{item.email}</TableCell>

            <TableCell>{item.qualification}</TableCell>

            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>

            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onEdit?.(item)}
                >
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => onDelete?.(item)}
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