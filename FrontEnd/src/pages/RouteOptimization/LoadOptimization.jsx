import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Users, CheckCircle, AlertCircle, TrendingUp, Package } from "lucide-react";

const LoadOptimization = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleId: "VH-001",
      driverName: "Rajesh Kumar",
      currentLoad: 3,
      capacity: 8,
      status: "UNDERLOADED",
      currentRoute: "Route A",
      aiSuggested: ["REQ-101", "REQ-105", "REQ-108"],
      location: "MP Nagar",
    },
    {
      id: 2,
      vehicleId: "VH-002",
      driverName: "Amit Sharma",
      currentLoad: 7,
      capacity: 8,
      status: "BALANCED",
      currentRoute: "Route B",
      aiSuggested: ["REQ-102"],
      location: "New Market",
    },
    {
      id: 3,
      vehicleId: "VH-003",
      driverName: "Suresh Patel",
      currentLoad: 8,
      capacity: 8,
      status: "OVERLOADED",
      currentRoute: "Route C",
      aiSuggested: [],
      location: "Hoshangabad Road",
    },
    {
      id: 4,
      vehicleId: "VH-004",
      driverName: "Vikram Singh",
      currentLoad: 2,
      capacity: 8,
      status: "UNDERLOADED",
      currentRoute: "Route D",
      aiSuggested: ["REQ-103", "REQ-106", "REQ-109", "REQ-112"],
      location: "Bairagarh",
    },
    {
      id: 5,
      vehicleId: "VH-005",
      driverName: "Mohit Verma",
      currentLoad: 5,
      capacity: 8,
      status: "BALANCED",
      currentRoute: "Route E",
      aiSuggested: ["REQ-107"],
      location: "Kolar Road",
    },
  ]);

  const [pendingRequests] = useState([
    { id: "REQ-101", pickup: "Station", delivery: "MP Nagar", priority: "HIGH" },
    { id: "REQ-102", pickup: "Airport", delivery: "New Market", priority: "MEDIUM" },
    { id: "REQ-103", pickup: "Bairagarh", delivery: "Kolar", priority: "LOW" },
    { id: "REQ-105", pickup: "Habibganj", delivery: "MP Nagar", priority: "HIGH" },
    { id: "REQ-106", pickup: "Kolar", delivery: "Bairagarh", priority: "MEDIUM" },
    { id: "REQ-107", pickup: "Ayodhya Bypass", delivery: "Kolar", priority: "MEDIUM" },
    { id: "REQ-108", pickup: "MP Nagar", delivery: "Station", priority: "LOW" },
    { id: "REQ-109", pickup: "Hoshangabad", delivery: "Bairagarh", priority: "MEDIUM" },
    { id: "REQ-112", pickup: "Bairagarh", delivery: "MP Nagar", priority: "HIGH" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "UNDERLOADED":
        return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", icon: AlertCircle };
      case "BALANCED":
        return { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", icon: CheckCircle };
      case "OVERLOADED":
        return { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", icon: AlertCircle };
      default:
        return { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700", icon: Package };
    }
  };

  const getLoadPercentage = (current, capacity) => {
    return Math.round((current / capacity) * 100);
  };

  const handleAssignRequest = (vehicleId, requestId) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId && v.currentLoad < v.capacity) {
          return {
            ...v,
            currentLoad: v.currentLoad + 1,
            status: v.currentLoad + 1 >= v.capacity ? "BALANCED" : v.currentLoad + 1 < v.capacity * 0.5 ? "UNDERLOADED" : "BALANCED",
            aiSuggested: v.aiSuggested.filter((r) => r !== requestId),
          };
        }
        return v;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Truck className="text-green-600" size={32} />
                Load Optimization
              </h1>
              <p className="text-slate-600 text-lg">
                AI-powered request assignment and load balancing
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{vehicles.length}</div>
              <div className="text-sm text-slate-600">Active Vehicles</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Balanced</div>
                <div className="text-3xl font-bold text-green-900">
                  {vehicles.filter((v) => v.status === "BALANCED").length}
                </div>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-yellow-700">Underloaded</div>
                <div className="text-3xl font-bold text-yellow-900">
                  {vehicles.filter((v) => v.status === "UNDERLOADED").length}
                </div>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-red-700">Overloaded</div>
                <div className="text-3xl font-bold text-red-900">
                  {vehicles.filter((v) => v.status === "OVERLOADED").length}
                </div>
              </div>
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-700">Pending Requests</div>
                <div className="text-3xl font-bold text-blue-900">{pendingRequests.length}</div>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        {/* Vehicles List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Vehicle & Driver Assignment</h2>
          <div className="space-y-4">
            {vehicles.map((vehicle) => {
              const statusStyle = getStatusColor(vehicle.status);
              const StatusIcon = statusStyle.icon;
              const loadPercentage = getLoadPercentage(vehicle.currentLoad, vehicle.capacity);

              return (
                <div
                  key={vehicle.id}
                  className={`border-2 ${statusStyle.border} ${statusStyle.bg} rounded-xl p-6`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg">
                        <Truck className="text-slate-700" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{vehicle.vehicleId}</h3>
                        <p className="text-slate-600 flex items-center gap-2">
                          <Users size={16} />
                          {vehicle.driverName}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border ${statusStyle.border} ${statusStyle.bg} flex items-center gap-2`}>
                      <StatusIcon className={statusStyle.text} size={18} />
                      <span className={`font-semibold ${statusStyle.text}`}>{vehicle.status}</span>
                    </div>
                  </div>

                  {/* Load Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Load: {vehicle.currentLoad} / {vehicle.capacity}</span>
                      <span className="font-semibold text-slate-900">{loadPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition ${
                          loadPercentage < 50
                            ? "bg-yellow-500"
                            : loadPercentage < 90
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${loadPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div>
                      <span className="text-slate-600">Route:</span>{" "}
                      <span className="font-semibold text-slate-900">{vehicle.currentRoute}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Location:</span>{" "}
                      <span className="font-semibold text-slate-900">{vehicle.location}</span>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {vehicle.aiSuggested.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-blue-600" size={18} />
                        <span className="font-semibold text-slate-900">AI Suggested Assignments:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.aiSuggested.map((requestId) => {
                          const request = pendingRequests.find((r) => r.id === requestId);
                          return (
                            <button
                              key={requestId}
                              onClick={() => handleAssignRequest(vehicle.id, requestId)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
                            >
                              <Package size={14} />
                              {requestId}
                              <span className="text-xs opacity-90">
                                ({request?.priority})
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
            <button
              onClick={() => navigate("/routes/dashboard")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
            >
              Back to Dashboard
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoadOptimization;

