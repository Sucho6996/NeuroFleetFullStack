import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  X,
  Route,
  ArrowRight,
  Car,
  Zap,
  Calendar,
  CheckCircle,
  Navigation,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =======================
   DUMMY VEHICLE DATA
======================= */
/* =======================
   LEAFLET ICON FIX
======================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* =======================
   CUSTOM MARKER ICONS
======================= */
const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const stopIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const endIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DUMMY_VEHICLES = [
  {
    id: "WB01AB1234",
    regNo: "WB01AB1234",
    name: "Bolero Pickup",
    type: "Diesel",
    location: "Kolkata",
    status: "AVAILABLE",
    fuel: 85,
    fuelType: "Petrol",
  },
  {
    id: "WB02CD5678",
    regNo: "WB02CD5678",
    name: "Tata Ace EV",
    type: "Electric",
    location: "Howrah",
    status: "AVAILABLE",
    fuel: 70,
    fuelType: "EV",
    battery: 70,
  },
  {
    id: "WB03EF9012",
    regNo: "WB03EF9012",
    name: "Ashok Leyland Dost",
    type: "Diesel",
    location: "Salt Lake",
    status: "AVAILABLE",
    fuel: 60,
    fuelType: "Petrol",
  },
  {
    id: "WB04GH3456",
    regNo: "WB04GH3456",
    name: "Mahindra Supro",
    type: "Diesel",
    location: "New Town",
    status: "AVAILABLE",
    fuel: 40,
    fuelType: "Petrol",
  },
];

const TripPlanning = () => {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    stops: [],
    optimizationPreference: "TIME",
  });

  const [currentStop, setCurrentStop] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [filters, setFilters] = useState({
    fuelType: "all",
  });

  /* =======================
     ROUTE MAPPING STATE
  ======================= */
  const [routeCoords, setRouteCoords] = useState({
    source: null,
    stops: [],
    destination: null,
  });
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [routeLoading, setRouteLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]); // Default to Kolkata
  const [routeError, setRouteError] = useState("");

  /* =======================
     LOAD DUMMY VEHICLES
  ======================= */
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVehicles(DUMMY_VEHICLES);
      setLoading(false);
    }, 800);
  }, []);

  /* =======================
     STOPS HANDLING
  ======================= */
  const handleAddStop = () => {
    if (currentStop.trim()) {
      setFormData({
        ...formData,
        stops: [...formData.stops, currentStop.trim()],
      });
      setCurrentStop("");
    }
  };

  const handleRemoveStop = (index) => {
    setFormData({
      ...formData,
      stops: formData.stops.filter((_, i) => i !== index),
    });
  };

  /* =======================
     TIME SLOTS
  ======================= */
  const timeSlots = [
    { time: "08:00", available: true },
    { time: "10:00", available: true },
    { time: "12:00", available: true },
    { time: "14:00", available: true },
    { time: "16:00", available: true },
    { time: "18:00", available: true },
    { time: "20:00", available: true },
  ];

  /* =======================
     FILTER VEHICLES
  ======================= */
  const filteredVehicles = vehicles.filter((v) => {
    if (filters.fuelType !== "all" && v.fuelType !== filters.fuelType)
      return false;
    return true;
  });

  /* =======================
     GEOCODING FUNCTION
  ======================= */
  const geocode = async (place) => {
    if (!place || place.trim() === "") {
      return null;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}&limit=1`
      );
      const data = await response.json();

      if (!data || data.length === 0) {
        return null;
      }

      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  /* =======================
     FETCH ROUTE FROM OSRM
  ======================= */
  const fetchRoute = async () => {
    if (!formData.source || !formData.destination) {
      setRouteError("Please enter source and destination");
      return;
    }

    setRouteLoading(true);
    setRouteError("");
    setRoutes([]);
    setSelectedRouteIndex(0);

    try {
      // Geocode all locations
      const sourceCoord = await geocode(formData.source);
      if (!sourceCoord) {
        setRouteError(`Could not find location: ${formData.source}`);
        setRouteLoading(false);
        return;
      }

      const destinationCoord = await geocode(formData.destination);
      if (!destinationCoord) {
        setRouteError(`Could not find location: ${formData.destination}`);
        setRouteLoading(false);
        return;
      }

      const stopCoords = [];
      for (const stop of formData.stops) {
        const coord = await geocode(stop);
        if (coord) {
          stopCoords.push(coord);
        } else {
          console.warn(`Could not geocode stop: ${stop}`);
        }
      }

      // Update coordinates state
      setRouteCoords({
        source: sourceCoord,
        stops: stopCoords,
        destination: destinationCoord,
      });

      // Build waypoint string for OSRM (lon,lat format)
      const allWaypoints = [
        sourceCoord,
        ...stopCoords,
        destinationCoord,
      ].map((coord) => `${coord[1]},${coord[0]}`); // lon,lat format for OSRM

      const waypointString = allWaypoints.join(";");

      // Fetch routes from OSRM with alternatives (up to 3 routes)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${waypointString}?alternatives=true&overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        setRouteError("No route found. Please check your locations.");
        setRouteLoading(false);
        return;
      }

      // Process all routes
      const processedRoutes = data.routes.map((route) => {
        // Convert GeoJSON coordinates to [lat, lon] format for Leaflet
        const routeCoordinates = route.geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]);

        return {
          coords: routeCoordinates,
          distance: (route.distance / 1000).toFixed(2), // km as string
          time: Math.round(route.duration / 60), // minutes
          rawDistance: route.distance, // in meters for sorting
          rawTime: route.duration, // in seconds for sorting
        };
      });

      // Sort routes by time (fastest first)
      const sortedByTime = [...processedRoutes].sort((a, b) => a.rawTime - b.rawTime);
      
      // Sort routes by distance (shortest first for fuel efficient)
      const sortedByDistance = [...processedRoutes].sort((a, b) => a.rawDistance - b.rawDistance);

      // Categorize routes
      const categorizedRoutes = [];
      
      // 1. Fastest Route (shortest time) - Green
      if (sortedByTime.length > 0) {
        categorizedRoutes.push({
          ...sortedByTime[0],
          name: "Fastest Route",
          type: "FASTEST",
          color: "#22c55e", // Green
          icon: "🚀",
        });
      }

      // 2. Fuel Efficient Route (shortest distance) - Blue
      const fuelEfficientRoute = sortedByDistance.find(
        (r) => r.rawDistance !== sortedByTime[0]?.rawDistance
      ) || sortedByDistance[0];
      
      if (fuelEfficientRoute && !categorizedRoutes.find(r => r.rawDistance === fuelEfficientRoute.rawDistance)) {
        categorizedRoutes.push({
          ...fuelEfficientRoute,
          name: "Fuel Efficient",
          type: "FUEL_EFFICIENT",
          color: "#3b82f6", // Blue
          icon: "⛽",
        });
      }

      // 3. Traffic Avoidance Route (longer distance, different path) - Orange
      // Find a route that's different from the first two
      const trafficAvoidanceRoute = processedRoutes.find(
        (r) =>
          r.rawDistance !== categorizedRoutes[0]?.rawDistance &&
          r.rawDistance !== categorizedRoutes[1]?.rawDistance
      ) || processedRoutes.find(
        (r) => r.rawDistance !== categorizedRoutes[0]?.rawDistance
      ) || processedRoutes[processedRoutes.length - 1];

      if (trafficAvoidanceRoute && categorizedRoutes.length < 3) {
        // Check if this route is already added
        const alreadyAdded = categorizedRoutes.some(
          (r) => r.rawDistance === trafficAvoidanceRoute.rawDistance
        );
        
        if (!alreadyAdded) {
          categorizedRoutes.push({
            ...trafficAvoidanceRoute,
            name: "Traffic Avoidance",
            type: "TRAFFIC_AVOIDANCE",
            color: "#f59e0b", // Orange
            icon: "🚦",
          });
        }
      }

      // If we still don't have 3 routes, fill with remaining alternatives
      while (categorizedRoutes.length < 3 && processedRoutes.length > categorizedRoutes.length) {
        const remaining = processedRoutes.find(
          (r) => !categorizedRoutes.some(cr => cr.rawDistance === r.rawDistance)
        );
        if (remaining) {
          categorizedRoutes.push({
            ...remaining,
            name: categorizedRoutes.length === 1 ? "Fuel Efficient" : "Traffic Avoidance",
            type: categorizedRoutes.length === 1 ? "FUEL_EFFICIENT" : "TRAFFIC_AVOIDANCE",
            color: categorizedRoutes.length === 1 ? "#3b82f6" : "#f59e0b",
            icon: categorizedRoutes.length === 1 ? "⛽" : "🚦",
          });
        } else {
          break;
        }
      }

      // Ensure we have exactly 3 routes by duplicating if needed
      if (categorizedRoutes.length === 2 && processedRoutes.length === 1) {
        // If only one route available, create variations
        const baseRoute = categorizedRoutes[0];
        categorizedRoutes.push({
          ...baseRoute,
          name: "Traffic Avoidance",
          type: "TRAFFIC_AVOIDANCE",
          color: "#f59e0b",
          icon: "🚦",
          distance: (baseRoute.distance * 1.1).toFixed(2),
          time: baseRoute.time + 2,
        });
      }

      // Final routes - ensure order: Fastest, Fuel Efficient, Traffic Avoidance
      const finalRoutes = [];
      
      // 1. Fastest Route (must be first)
      const fastest = categorizedRoutes.find(r => r.type === "FASTEST") || categorizedRoutes[0];
      if (fastest) finalRoutes.push(fastest);
      
      // 2. Fuel Efficient Route
      const fuelEfficient = categorizedRoutes.find(r => r.type === "FUEL_EFFICIENT" && r.rawDistance !== fastest?.rawDistance) 
        || categorizedRoutes.find(r => r.type === "FUEL_EFFICIENT") 
        || (categorizedRoutes.length > 1 ? categorizedRoutes[1] : categorizedRoutes[0]);
      if (fuelEfficient && finalRoutes.length < 3) {
        if (!finalRoutes.find(r => r.rawDistance === fuelEfficient.rawDistance)) {
          finalRoutes.push(fuelEfficient);
        } else if (categorizedRoutes.length > 1) {
          const alt = categorizedRoutes.find(r => r.rawDistance !== fastest?.rawDistance && r.rawDistance !== fuelEfficient?.rawDistance);
          if (alt) finalRoutes.push(alt);
        }
      }
      
      // 3. Traffic Avoidance Route
      const trafficAvoidance = categorizedRoutes.find(r => r.type === "TRAFFIC_AVOIDANCE" 
        && r.rawDistance !== fastest?.rawDistance 
        && r.rawDistance !== fuelEfficient?.rawDistance)
        || categorizedRoutes.find(r => r.type === "TRAFFIC_AVOIDANCE")
        || (categorizedRoutes.length > 2 ? categorizedRoutes[2] : categorizedRoutes[categorizedRoutes.length - 1] || categorizedRoutes[0]);
      if (trafficAvoidance && finalRoutes.length < 3) {
        if (!finalRoutes.find(r => r.rawDistance === trafficAvoidance.rawDistance)) {
          finalRoutes.push(trafficAvoidance);
        }
      }

      // Ensure we have exactly 3 routes, filling with available routes if needed
      while (finalRoutes.length < 3 && categorizedRoutes.length > 0) {
        const missing = categorizedRoutes.find(r => !finalRoutes.find(fr => fr.rawDistance === r.rawDistance));
        if (missing) {
          finalRoutes.push(missing);
        } else {
          // If no unique route, duplicate last one with variation
          const last = finalRoutes[finalRoutes.length - 1];
          finalRoutes.push({
            ...last,
            name: finalRoutes.length === 1 ? "Fuel Efficient" : "Traffic Avoidance",
            type: finalRoutes.length === 1 ? "FUEL_EFFICIENT" : "TRAFFIC_AVOIDANCE",
            color: finalRoutes.length === 1 ? "#3b82f6" : "#f59e0b",
            icon: finalRoutes.length === 1 ? "⛽" : "🚦",
          });
        }
      }

      const limitedRoutes = finalRoutes.slice(0, 3);

      // Calculate map center from coordinates
      const allCoords = [sourceCoord, ...stopCoords, destinationCoord];
      const centerLat = allCoords.reduce((sum, coord) => sum + coord[0], 0) / allCoords.length;
      const centerLon = allCoords.reduce((sum, coord) => sum + coord[1], 0) / allCoords.length;

      setMapCenter([centerLat, centerLon]);
      setRoutes(limitedRoutes);
      setSelectedRouteIndex(0); // Select fastest route by default
    } catch (error) {
      console.error("Route fetching error:", error);
      setRouteError("Error fetching route. Please try again.");
    } finally {
      setRouteLoading(false);
    }
  };

  /* =======================
     CONTINUE
  ======================= */
  const handleContinue = () => {
    if (
      !selectedVehicle ||
      !selectedDate ||
      !selectedTimeSlot ||
      !formData.source ||
      !formData.destination
    ) {
      alert("Please fill all required fields");
      return;
    }

    navigate("/booking/confirmation", {
      state: {
        vehicle: selectedVehicle,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        routeData: formData,
      },
    });
  };

  /* =======================
     LOADING UI
  ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl border p-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Route className="text-green-600" /> Plan Your Trip
          </h1>
          <p className="text-slate-600 mt-1">
            Enter route details and choose a vehicle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* ROUTE */}
            <div className="bg-white rounded-xl border p-6 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPin className="text-green-600" /> Trip Details
              </h2>

              <input
                placeholder="Source"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />

              <div className="flex gap-2">
                <input
                  placeholder="Add Stop"
                  value={currentStop}
                  onChange={(e) => setCurrentStop(e.target.value)}
                  className="flex-1 p-3 border rounded-xl"
                />
                <button
                  onClick={handleAddStop}
                  className="bg-green-600 text-white px-5 rounded-xl"
                >
                  <Plus />
                </button>
              </div>

              {formData.stops.map((stop, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-green-50 p-2 rounded"
                >
                  {stop}
                  <X
                    className="cursor-pointer text-red-600"
                    onClick={() => handleRemoveStop(i)}
                  />
                </div>
              ))}

              <input
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
              />

              {/* Show Route Button */}
              <button
                onClick={fetchRoute}
                disabled={routeLoading || !formData.source || !formData.destination}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition"
              >
                {routeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-r-2"></div>
                    Fetching Route...
                  </>
                ) : (
                  <>
                    <Navigation size={20} />
                    Show Route on Map
                  </>
                )}
              </button>

              {/* Route Error */}
              {routeError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                  {routeError}
                </div>
              )}

              {/* Route Options with Radio Buttons */}
              {routes.length > 0 && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Route className="text-green-600" size={18} />
                    Select Route ({routes.length} {routes.length === 1 ? "option" : "options"})
                  </h4>
                  <div className="space-y-2">
                    {routes.map((r, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${
                          selectedRouteIndex === i
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="route"
                          checked={selectedRouteIndex === i}
                          onChange={() => setSelectedRouteIndex(i)}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: r.color }}
                            ></div>
                            <span className="font-medium text-slate-900">
                              {r.icon} {r.name}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {r.distance} km | {r.time} mins
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* VEHICLES */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Car className="text-green-600" /> Select Vehicle
              </h2>

              <div className="flex gap-2 mb-4">
                {["all", "EV", "Petrol"].map((fuel) => (
                  <button
                    key={fuel}
                    onClick={() =>
                      setFilters({ ...filters, fuelType: fuel })
                    }
                    className={`px-4 py-2 rounded ${
                      filters.fuelType === fuel
                        ? "bg-green-600 text-white"
                        : "bg-slate-100"
                    }`}
                  >
                    {fuel}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredVehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`border p-4 rounded-xl cursor-pointer ${
                      selectedVehicle?.id === v.id
                        ? "border-green-600 bg-green-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{v.name}</h3>
                        <p className="text-sm">{v.regNo}</p>
                      </div>
                      {selectedVehicle?.id === v.id && (
                        <CheckCircle className="text-green-600" />
                      )}
                    </div>

                    <div className="text-sm mt-2 flex gap-3">
                      {v.fuelType === "EV" ? (
                        <Zap className="text-green-600" size={16} />
                      ) : (
                        <Car size={16} />
                      )}
                      {v.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="text-green-600" /> Date & Time
              </h2>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-3 border rounded-xl w-full mb-4"
              />

              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2 rounded border ${
                      selectedTimeSlot?.time === slot.time
                        ? "bg-green-600 text-white"
                        : ""
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-xl border p-6 sticky top-6 h-fit">
            <h3 className="font-semibold mb-4">Trip Summary</h3>
            <div className="space-y-2 text-sm">
              <p><b>From:</b> {formData.source || "-"}</p>
              {formData.stops.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Stops ({formData.stops.length}):</p>
                  <ul className="list-disc list-inside ml-2 space-y-1 text-xs">
                    {formData.stops.map((stop, i) => (
                      <li key={i}>{stop}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><b>To:</b> {formData.destination || "-"}</p>
              {routes.length > 0 && routes[selectedRouteIndex] && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-green-700 font-semibold flex items-center gap-2">
                    {routes[selectedRouteIndex].icon} {routes[selectedRouteIndex].name}
                  </p>
                  <p className="text-xs mt-1">
                    <b>Distance:</b> {routes[selectedRouteIndex].distance} km
                  </p>
                  <p className="text-xs">
                    <b>Time:</b> ~{routes[selectedRouteIndex].time} mins
                  </p>
                  <div 
                    className="text-xs mt-2 p-2 rounded"
                    style={{ 
                      backgroundColor: `${routes[selectedRouteIndex].color}20`,
                      color: routes[selectedRouteIndex].color,
                      fontWeight: '600'
                    }}
                  >
                    Selected Route
                  </div>
                </div>
              )}
              <p className="pt-2"><b>Vehicle:</b> {selectedVehicle?.name || "-"}</p>
              <p><b>Date:</b> {selectedDate || "-"}</p>
              <p><b>Time:</b> {selectedTimeSlot?.time || "-"}</p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Continue <ArrowRight />
            </button>
          </div>
        </div>

        {/* ROUTE MAP SECTION */}
        {(routes.length > 0 || routeCoords.source || routeCoords.destination) && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="text-green-600" /> Route Map
            </h2>
            
            <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200">
              <MapContainer
                center={mapCenter}
                zoom={routes.length > 0 ? 12 : 10}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Source Marker */}
                {routeCoords.source && (
                  <Marker position={routeCoords.source} icon={startIcon}>
                    <Popup>
                      <div>
                        <strong>Start:</strong> {formData.source}
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Stop Markers */}
                {routeCoords.stops.map((stopCoord, index) => (
                  <Marker
                    key={index}
                    position={stopCoord}
                    icon={stopIcon}
                  >
                    <Popup>
                      <div>
                        <strong>Stop {index + 1}:</strong> {formData.stops[index]}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Destination Marker */}
                {routeCoords.destination && (
                  <Marker position={routeCoords.destination} icon={endIcon}>
                    <Popup>
                      <div>
                        <strong>Destination:</strong> {formData.destination}
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Route Polylines - All routes with selection styling */}
                {routes.map((r, i) => (
                  <Polyline
                    key={i}
                    positions={r.coords}
                    pathOptions={{
                      color: r.color,
                      weight: selectedRouteIndex === i ? 7 : 3,
                      opacity: selectedRouteIndex === i ? 1 : 0.4,
                      dashArray: selectedRouteIndex === i ? null : "8,8",
                    }}
                  />
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanning;
