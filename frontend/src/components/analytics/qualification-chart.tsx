"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

interface Props {
  data: {
    qualification: string;
    count: number;
  }[];
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

export default function QualificationChart({
  data,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Qualification Distribution
        </h2>
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="qualification"
                outerRadius={130}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}