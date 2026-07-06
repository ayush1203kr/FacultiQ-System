interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  const styles = {
    ACTIVE:
      "bg-green-100 text-green-700",
    ON_LEAVE:
      "bg-yellow-100 text-yellow-700",
    INACTIVE:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status as keyof typeof styles] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}