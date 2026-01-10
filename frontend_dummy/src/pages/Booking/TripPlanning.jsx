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
} from "lucide-react";

/* =======================
   DUMMY VEHICLE DATA
======================= */
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
            <p><b>From:</b> {formData.source || "-"}</p>
            <p><b>To:</b> {formData.destination || "-"}</p>
            <p><b>Vehicle:</b> {selectedVehicle?.name || "-"}</p>
            <p><b>Date:</b> {selectedDate || "-"}</p>
            <p><b>Time:</b> {selectedTimeSlot?.time || "-"}</p>

            <button
              onClick={handleContinue}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
            >
              Continue <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanning;
