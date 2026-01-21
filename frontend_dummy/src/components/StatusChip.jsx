const statusStyles = {
  AVAILABLE:
    "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.05)]",
  IN_USE:
    "bg-sky-50 text-sky-700 border border-sky-100 shadow-[0_0_0_1px_rgba(56,189,248,0.05)]",
  MAINTENANCE:
    "bg-rose-50 text-rose-700 border border-rose-100 shadow-[0_0_0_1px_rgba(244,63,94,0.05)]",
};

const StatusChip = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] tracking-wide rounded-full font-medium uppercase ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusChip;
