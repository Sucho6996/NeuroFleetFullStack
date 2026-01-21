import React from "react";
import { X } from "lucide-react";

const AlertsModal = ({ open, onClose, data = [], loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900">
            <X />
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading alerts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Reg No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Issue</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {data && data.length > 0 ? (
                    data.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{a.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{a.regNo || a.vehicleId || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{a.issue || a.type || "-"}</td>
                        <td className="px-4 py-3 text-sm text-slate-800">{a.email || a.reportedBy || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-500">No alerts available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
