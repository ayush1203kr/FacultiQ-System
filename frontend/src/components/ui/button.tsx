import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export default function Button({
  className,
  variant = "default",
  ...props
}: ButtonProps) {
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive:
      "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}