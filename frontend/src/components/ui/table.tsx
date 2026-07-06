import { cn } from "@/lib/utils";

export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table
        className={cn("min-w-full text-sm", className)}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <thead className="bg-slate-100">
      {children}
    </thead>
  );
}

export function TableBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b last:border-none hover:bg-slate-50">
      {children}
    </tr>
  );
}

export function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left font-semibold">
      {children}
    </th>
  );
}

export function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td className="px-4 py-3">
      {children}
    </td>
  );
}