import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Clock, MapPin, Zap, TrendingUp } from "lucide-react";

const RouteComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { routes: initialRoutes, routeData } = location.state || {};

  const [routes, setRoutes] = useState(
    initialRoutes || [
      {
        id: 1,
        name: "Fastest Route",
        mode: "TIME",
        color: "#16a34a",
        eta: "14 mins",
        etaValue: 14,
        distance: "5.1 km",
        distanceValue: 5.1,
        energy: "Medium",
        energyValue: 2,
        fuelUsage: "2.5L",
        cost: "₹180",
        recommended: false,
      },
      {
        id: 2,
        name: "Low Traffic Route",
        mode: "TRAFFIC",
        color: "#f97316",
        eta: "16 mins",
        etaValue: 16,
        distance: "6.0 km",
        distanceValue: 6.0,
        energy: "High",
        energyValue: 3,
        fuelUsage: "3.2L",
        cost: "₹230",
        recommended: false,
      },
      {
        id: 3,
        name: "Energy Efficient",
        mode: "ENERGY",
        color: "#2563eb",
        eta: "18 mins",
        etaValue: 18,
        distance: "5.8 km",
        distanceValue: 5.8,
        energy: "Low",
        energyValue: 1,
        fuelUsage: "2.1L",
        cost: "₹150",
        recommended: true,
      },
    ]
  );

  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSelectRoute = (routeId) => {
    setSelectedRoute(routeId);
  };

  const handleConfirmSelection = () => {
    if (selectedRoute) {
      const route = routes.find((r) => r.id === selectedRoute);
      navigate("/routes/live-tracking", {
        state: { route, routeData },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Route Comparison</h1>
          <p className="text-slate-600">
            Compare different route options and select the best one for your trip
          </p>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routes.map((route) => {
            const isSelected = selectedRoute === route.id;
            return (
              <div
                key={route.id}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 transition cursor-pointer ${
                  isSelected
                    ? "border-green-500 ring-4 ring-green-200"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => handleSelectRoute(route.id)}
              >
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <h3 className="text-xl font-bold text-slate-900">{route.name}</h3>
                  </div>
                  {isSelected && (
                    <div className="bg-green-600 text-white rounded-full p-1">
                      <Check size={20} />
                    </div>
                  )}
                  {route.recommended && !isSelected && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
                      Recommended
                    </span>
                  )}
                </div>

                {/* Route Details */}
                <div className="space-y-4">
                  {/* ETA */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Estimated Time</div>
                      <div className="text-lg font-bold text-slate-900">{route.eta}</div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Distance</div>
                      <div className="text-lg font-bold text-slate-900">{route.distance}</div>
                    </div>
                  </div>

                  {/* Energy/Fuel */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="text-green-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Fuel Usage</div>
                      <div className="text-lg font-bold text-slate-900">{route.fuelUsage}</div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Estimated Cost</div>
                      <div className="text-lg font-bold text-slate-900">{route.cost}</div>
                    </div>
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRoute(route.id);
                  }}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
                    isSelected
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {isSelected ? "Selected" : "Select This Route"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison Summary */}
        {selectedRoute && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Selected Route Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const selected = routes.find((r) => r.id === selectedRoute);
                return (
                  <>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-sm text-slate-600">Time</div>
                      <div className="text-2xl font-bold text-green-900">{selected.eta}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-sm text-slate-600">Distance</div>
                      <div className="text-2xl font-bold text-green-900">{selected.distance}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-sm text-slate-600">Fuel</div>
                      <div className="text-2xl font-bold text-green-900">{selected.fuelUsage}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-sm text-slate-600">Cost</div>
                      <div className="text-2xl font-bold text-green-900">{selected.cost}</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/routes/visualize", { state: { routes, routeData } })}
            className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
          >
            Back to Map
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedRoute}
            className={`flex-1 px-6 py-4 rounded-xl transition font-semibold ${
              selectedRoute
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            Confirm & Start Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteComparison;

