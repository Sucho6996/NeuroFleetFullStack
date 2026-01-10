import React from "react";
import { useNavigate } from "react-router-dom";

const severityStyles = {
  CRITICAL: "bg-red-100 text-red-700",
  DUE: "bg-yellow-100 text-yellow-700",
  NORMAL: "bg-green-100 text-green-700",
};

// Optional: derive severity from issue text
const getSeverity = (issue) => {
  if (!issue) return "NORMAL";

  const text = issue.toLowerCase();

  if (
    text.includes("engine") ||
    text.includes("brake") ||
    text.includes("overheat")
  ) {
    return "CRITICAL";
  }

  if (
    text.includes("service") ||
    text.includes("oil") ||
    text.includes("maintenance")
  ) {
    return "DUE";
  }

  return "NORMAL";
};

const AlertTable = ({ data = [] }) => {
  const navigate = useNavigate();

  const handleRowClick = (regNo) => {
    navigate(`/fleet/maintenance/${regNo}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-200 rounded-lg">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Vehicle Reg No
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Issue
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Severity
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
              Action Needed
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-6 text-slate-500"
              >
                No alerts available
              </td>
            </tr>
          ) : (
            data.map((alert) => {
              const severity = getSeverity(alert.issue);

              return (
                <tr
                  key={alert.id}
                  onClick={() => handleRowClick(alert.regNo)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {alert.regNo}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-800">
                    {alert.issue}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        severityStyles[severity]
                      }`}
                    >
                      {severity}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {alert.actionNeeded}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlertTable;
