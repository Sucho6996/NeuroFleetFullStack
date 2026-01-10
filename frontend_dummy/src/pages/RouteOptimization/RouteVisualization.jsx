import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RouteVisualization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeData = location.state?.routeData || {
    source: "Bhopal Station",
    destination: "MP Nagar",
    optimizationPreference: "TIME",
    vehicleType: "car",
  };

  const [routes, setRoutes] = useState([
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
      active: true,
      recommended: false,
      path: [
        [23.2599, 77.4126],
        [23.2635, 77.4162],
        [23.2650, 77.4200],
      ],
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
      active: false,
      recommended: false,
      path: [
        [23.2599, 77.4126],
        [23.2625, 77.4135],
        [23.2640, 77.4165],
        [23.2630, 77.4185],
        [23.2650, 77.4200],
      ],
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
      active: false,
      recommended: false,
      path: [
        [23.2599, 77.4126],
        [23.2580, 77.4140],
        [23.2605, 77.4180],
        [23.2650, 77.4200],
      ],
    },
  ]);

  const trafficZones = [
    {
      id: 1,
      center: [23.2628, 77.4168],
      radius: 400,
      level: "HIGH",
      color: "#dc2626",
    },
    {
      id: 2,
      center: [23.2610, 77.4145],
      radius: 300,
      level: "MEDIUM",
      color: "#f97316",
    },
  ];

  useEffect(() => {
    // Set recommended route based on preference
    const preferenceMap = {
      TIME: 1,
      TRAFFIC: 2,
      ENERGY: 3,
    };

    const recommendedId = preferenceMap[routeData.optimizationPreference] || 1;
    setRoutes((prev) =>
      prev.map((r) => ({
        ...r,
        active: r.id === recommendedId,
        recommended: r.id === recommendedId,
      }))
    );
  }, [routeData.optimizationPreference]);

  const selectRoute = (id) => {
    setRoutes((prev) =>
      prev.map((r) => ({
        ...r,
        active: r.id === id,
      }))
    );
  };

  const activeRoute = routes.find((r) => r.active) || routes[0];
  const start = activeRoute.path[0];
  const end = activeRoute.path[activeRoute.path.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Route Visualization</h1>
              <p className="text-slate-600">
                {routeData.source} → {routeData.destination}
              </p>
            </div>
            <button
              onClick={() => navigate("/routes/comparison", { state: { routes, routeData } })}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
            >
              Compare Routes
            </button>
          </div>
        </div>

        {/* Map and Route Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-[600px]">
              <MapContainer center={start} zoom={13} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Start Marker */}
                <Marker position={start} icon={startIcon}>
                  <Popup>
                    <strong>Start:</strong> {routeData.source}
                  </Popup>
                </Marker>

                {/* End Marker */}
                <Marker position={end} icon={endIcon}>
                  <Popup>
                    <strong>Destination:</strong> {routeData.destination}
                  </Popup>
                </Marker>

                {/* Traffic Zones */}
                {trafficZones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.25,
                    }}
                  >
                    <Popup>
                      <strong>{zone.level} Traffic Zone</strong>
                    </Popup>
                  </Circle>
                ))}

                {/* Route Polylines */}
                {routes.map((route) => (
                  <Polyline
                    key={route.id}
                    positions={route.path}
                    pathOptions={{
                      color: route.color,
                      weight: route.active ? 6 : 3,
                      opacity: route.active ? 1 : 0.4,
                    }}
                  />
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Route Options */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Route Options</h3>
              <div className="space-y-3">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => selectRoute(route.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                      route.active
                        ? `border-${route.color} bg-${route.color}50`
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                    style={
                      route.active
                        ? {
                            borderColor: route.color,
                            backgroundColor: `${route.color}15`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{route.name}</h4>
                      {route.recommended && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-600 text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <span>ETA: <strong>{route.eta}</strong></span>
                      </div>
                      <div>Distance: {route.distance}</div>
                      <div>Energy: {route.energy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Route Details */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-3">Selected Route</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-green-700">Route:</span>{" "}
                  <strong className="text-green-900">{activeRoute.name}</strong>
                </div>
                <div>
                  <span className="text-green-700">ETA:</span>{" "}
                  <strong className="text-green-900">{activeRoute.eta}</strong>
                </div>
                <div>
                  <span className="text-green-700">Distance:</span>{" "}
                  <strong className="text-green-900">{activeRoute.distance}</strong>
                </div>
                <div>
                  <span className="text-green-700">Energy:</span>{" "}
                  <strong className="text-green-900">{activeRoute.energy}</strong>
                </div>
              </div>
              <button
                onClick={() => navigate("/routes/live-tracking", { state: { route: activeRoute, routeData } })}
                className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Start Navigation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;

