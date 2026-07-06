"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  totals: {
    faculty: number;
    departments: number;
    active: number;
    onLeave: number;
    inactive: number;
  };
}

export default function AnalyticsCards({
  totals,
}: Props) {
  const cards = [
    {
      title: "Total Faculty",
      value: totals.faculty,
    },
    {
      title: "Departments",
      value: totals.departments,
    },
    {
      title: "Active Faculty",
      value: totals.active,
    },
    {
      title: "On Leave",
      value: totals.onLeave,
    },
    {
      title: "Inactive",
      value: totals.inactive,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent>
            <p className="text-sm text-gray-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {card.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}