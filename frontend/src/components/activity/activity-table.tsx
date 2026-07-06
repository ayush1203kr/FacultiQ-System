"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Activity } from "@/hooks/useActivity";

interface Props {
  activity: Activity[];
}

export default function ActivityTable({
  activity,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>

          <TableHead>Entity</TableHead>

          <TableHead>Details</TableHead>

          <TableHead>User</TableHead>

          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {activity.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.action === "CREATE"
                    ? "bg-green-100 text-green-700"
                    : item.action === "UPDATE"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.action}
              </span>
            </TableCell>

            <TableCell>{item.entity}</TableCell>

            <TableCell>
              <div className="space-y-1">
                <div className="font-medium">
                  {item.metadata?.name ?? "-"}
                </div>

                {item.metadata?.employeeId && (
                  <div className="text-xs text-gray-500">
                    {item.metadata.employeeId}
                  </div>
                )}

                {item.metadata?.department && (
                  <div className="text-xs text-gray-500">
                    {item.metadata.department}
                  </div>
                )}
              </div>
            </TableCell>

            <TableCell>{item.actor.email}</TableCell>

            <TableCell>
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}