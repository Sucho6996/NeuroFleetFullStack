import React, { useState, useEffect } from "react";
import { AlertCircle, Plus } from "lucide-react";
import AlertTable from "../../components/AlertTable";
import AddAlertModal from "../../components/AddAlertModal";
import { getAllAlerts, addAlert } from "../../services/fleetManagerApis";

const FleetManagerAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // Fetch alerts from backend
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAlerts();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setAlerts(data);
      } else if (data && Array.isArray(data.data)) {
        setAlerts(data.data);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to load alerts. Please try again.");
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = async (alertData) => {
    try {
      setAdding(true);
      await addAlert(alertData);
      await fetchAlerts(); // Refresh the list
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Error adding alert:", err);
      alert("Failed to add alert. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Fleet Alerts</h2>
              <p className="text-slate-600 text-sm mt-1">
                Monitor and manage vehicle alerts and issues
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
          >
            <Plus size={20} />
            Add Alert
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Alerts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {alerts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-600 text-lg">No alerts found</p>
              <p className="text-slate-500 text-sm mt-2">
                Click "Add Alert" to create a new alert
              </p>
            </div>
          ) : (
            <AlertTable data={alerts} />
          )}
        </div>

        {/* Add Alert Modal */}
        {isAddModalOpen && (
          <AddAlertModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddAlert}
          />
        )}
      </main>
    </div>
  );
};

export default FleetManagerAlerts;

