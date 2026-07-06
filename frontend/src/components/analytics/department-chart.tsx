"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  data: {
    department: string;
    count: number;
  }[];
}

export default function DepartmentChart({
  data,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Faculty by Department
        </h2>
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="department" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#4f46e5"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}