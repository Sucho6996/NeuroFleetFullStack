import React from "react";

const DashboardCard = ({ title, value, change, icon: Icon, color, bgColor }) => {
  // Default to white background with slate colors if no color specified
  const cardBgColor = bgColor || "bg-white";
  
  // Color mapping for Tailwind classes (must use full class names)
  const colorClasses = {
    green: {
      border: "border-green-200",
      title: "text-green-700",
      value: "text-green-900",
      change: "text-green-700",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      hover: "hover:bg-green-50",
    },
    blue: {
      border: "border-blue-200",
      title: "text-blue-700",
      value: "text-blue-900",
      change: "text-blue-700",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      hover: "hover:bg-blue-50",
    },
    purple: {
      border: "border-purple-200",
      title: "text-purple-700",
      value: "text-purple-900",
      change: "text-purple-700",
      iconBg: "bg-purple-100",
      iconText: "text-purple-600",
      hover: "hover:bg-purple-50",
    },
    orange: {
      border: "border-orange-200",
      title: "text-orange-700",
      value: "text-orange-900",
      change: "text-orange-700",
      iconBg: "bg-orange-100",
      iconText: "text-orange-600",
      hover: "hover:bg-orange-50",
    },
    default: {
      border: "border-slate-200",
      title: "text-slate-600",
      value: "text-slate-900",
      change: "text-slate-600",
      iconBg: "bg-slate-100",
      iconText: "text-slate-700",
      hover: "hover:bg-slate-50",
    },
  };

  const colors = colorClasses[color] || colorClasses.default;

  return (
    <div className={`
      ${cardBgColor}
      border ${colors.border}
      rounded-xl
      p-6
      shadow-sm
      ${colors.hover}
      transition
    `}>
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
