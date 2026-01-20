const statusStyles = {
  AVAILABLE: "bg-green-500/20 text-green-400",
  IN_USE: "bg-blue-500/20 text-blue-400",
  MAINTENANCE: "bg-red-500/20 text-red-400",
};

const StatusChip = ({ status }) => {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusChip;
