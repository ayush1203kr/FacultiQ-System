"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

interface Props {
  data: {
    month: string;
    count: number;
  }[];
}

export default function MonthlyChart({
  data,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Monthly Faculty Joining Trend
        </h2>
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563EB"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}