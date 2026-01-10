import React from "react";

const getColor = (value) => {
  if (value >= 80) return "bg-green-500";
  if (value >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const HealthProgressBar = ({ label, value }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default HealthProgressBar;
