import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, AlertCircle, Clock, MapPin, RefreshCw, Route as RouteIcon } from "lucide-react";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  iconSize: [32, 41],
  iconAnchor: [16, 41],
  popupAnchor: [1, -34],
});

const LiveTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { route: initialRoute, routeData } = location.state || {};

  const [currentPosition, setCurrentPosition] = useState([23.2605, 77.4145]);
  const [eta, setEta] = useState(14);
  const [distanceRemaining, setDistanceRemaining] = useState(4.2);
  const [isMoving, setIsMoving] = useState(true);
  const [routeDeviated, setRouteDeviated] = useState(false);
  const [route] = useState(
    initialRoute || {
      path: [
        [23.2599, 77.4126],
        [23.2635, 77.4162],
        [23.2650, 77.4200],
      ],
      name: "Fastest Route",
      eta: "14 mins",
      distance: "5.1 km",
    }
  );

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        // Simulate movement along route
        const [lat, lng] = prev;
        return [lat + 0.0001, lng + 0.0001];
      });

      setEta((prev) => (prev > 0 ? prev - 1 : 0));
      setDistanceRemaining((prev) => (prev > 0 ? (prev - 0.1).toFixed(1) : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMoving]);

  const handleReRoute = () => {
    setRouteDeviated(false);
    // In real app, this would call the routing API
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Navigation className="text-green-600" size={32} />
                Live Tracking
              </h1>
              <p className="text-slate-600 text-lg">Real-time navigation and route monitoring</p>
            </div>
            <button
              onClick={() => setIsMoving(!isMoving)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition flex items-center gap-2"
            >
              <RefreshCw size={20} />
              {isMoving ? "Pause" : "Resume"}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-700">ETA</div>
                <div className="text-3xl font-bold text-blue-900">{eta} min</div>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-700">Distance Remaining</div>
                <div className="text-3xl font-bold text-green-900">{distanceRemaining} km</div>
              </div>
              <RouteIcon className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-700">Route</div>
                <div className="text-xl font-bold text-purple-900">{route.name}</div>
              </div>
              <MapPin className="text-purple-600" size={32} />
            </div>
          </div>
          <div className={`border-2 rounded-xl p-6 ${routeDeviated ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm">Status</div>
                <div className={`text-xl font-bold ${routeDeviated ? "text-red-900" : "text-green-900"}`}>
                  {routeDeviated ? "Deviated" : "On Route"}
                </div>
              </div>
              <AlertCircle className={routeDeviated ? "text-red-600" : "text-green-600"} size={32} />
            </div>
          </div>
        </div>

          {/* Route Deviation Alert */}
        {routeDeviated && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="text-red-600" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-1">Route Deviation Detected</h3>
                  <p className="text-red-700">You have deviated from the planned route. Re-routing recommended.</p>
                </div>
              </div>
              <button
                onClick={handleReRoute}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
              >
                Re-route
              </button>
            </div>
          </div>
        )}

        {/* Map and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-[600px]">
              <MapContainer center={currentPosition} zoom={14} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Planned Route */}
                <Polyline
                  positions={route.path}
                  pathOptions={{
                    color: "#2563eb",
                    weight: 4,
                    opacity: 0.6,
                    dashArray: "10, 10",
                  }}
                />

                {/* Current Vehicle Position */}
                <Marker position={currentPosition} icon={vehicleIcon}>
                  <Popup>
                    <div>
                      <strong>Current Location</strong>
                      <div className="mt-2">
                        <div>ETA: {eta} minutes</div>
                        <div>Distance: {distanceRemaining} km</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination Marker */}
                {route.path.length > 0 && (
                  <Marker position={route.path[route.path.length - 1]}>
                    <Popup>
                      <strong>Destination</strong>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Route Info */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Route Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-slate-600">Route Type</div>
                  <div className="font-semibold text-slate-900">{route.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Total Distance</div>
                  <div className="font-semibold text-slate-900">{route.distance}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Estimated Time</div>
                  <div className="font-semibold text-slate-900">{route.eta}</div>
                </div>
              </div>
            </div>

            {/* Navigation Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Next Instructions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-semibold text-blue-900">In 200m</div>
                  <div className="text-sm text-blue-700">Turn right onto Station Road</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg opacity-60">
                  <div className="font-semibold text-slate-700">In 1.2 km</div>
                  <div className="text-sm text-slate-600">Continue straight</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <button
                onClick={() => setRouteDeviated(!routeDeviated)}
                className="w-full mb-3 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition"
              >
                Test Deviation Alert
              </button>
              <button
                onClick={() => navigate("/routes/dashboard")}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
              >
                End Navigation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;

