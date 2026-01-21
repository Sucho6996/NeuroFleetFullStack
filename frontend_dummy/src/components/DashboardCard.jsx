import React from "react";

const DashboardCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
  // Default to soft, elevated card if no custom background is specified
  const cardBgColor = bgColor || "bg-white/90 backdrop-blur-sm";
  
  // Color mapping for Tailwind classes (must use full class names)
  const colorClasses = {
    green: {
      border: "border-emerald-100",
      title: "text-emerald-700",
      value: "text-emerald-900",
      change: "text-emerald-600",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
      hover: "hover:bg-emerald-50/70",
    },
    blue: {
      border: "border-blue-100",
      title: "text-blue-700",
      value: "text-blue-900",
      change: "text-blue-700",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      hover: "hover:bg-blue-50/70",
    },
    purple: {
      border: "border-violet-100",
      title: "text-purple-700",
      value: "text-purple-900",
      change: "text-purple-700",
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
      hover: "hover:bg-violet-50/70",
    },
    orange: {
      border: "border-amber-100",
      title: "text-orange-700",
      value: "text-orange-900",
      change: "text-orange-700",
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
      hover: "hover:bg-amber-50/70",
    },
    default: {
      border: "border-slate-200/80",
      title: "text-slate-600",
      value: "text-slate-900",
      change: "text-slate-600",
      iconBg: "bg-slate-50",
      iconText: "text-slate-700",
      hover: "hover:bg-slate-50/80",
    },
  };

  const colors = colorClasses[color] || colorClasses.default;

  return (
    <div
      className={`
        ${cardBgColor}
        border ${colors.border}
        rounded-2xl
        p-5 sm:p-6
        shadow-sm
        ${colors.hover}
        transition-shadow transition-colors
        hover:shadow-md
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${colors.title}`}>{title}</p>
          <h3 className={`text-2xl font-bold ${colors.value} mt-1`}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${colors.iconBg} ${colors.iconText}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      {change && (
        <p className={`mt-4 text-sm font-medium ${colors.change}`}>
          {change}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
