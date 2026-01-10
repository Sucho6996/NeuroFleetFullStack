import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  Users, 
  Zap, 
  Filter, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  Star
} from "lucide-react";

const VehicleBooking = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "all",
    seats: "all",
    fuelType: "all",
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Mock vehicles data with AI recommendations
  const vehicles = [
    {
      id: "VH-001",
      type: "Sedan",
      name: "Toyota Camry",
      seats: 4,
      fuelType: "Petrol",
      pricePerHour: 350,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
      recommended: true,
      reason: "Matches your usual preference",
      available: true,
    },
    {
      id: "VH-002",
      type: "SUV",
      name: "Honda CR-V",
      seats: 7,
      fuelType: "EV",
      pricePerHour: 550,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400",
      recommended: true,
      reason: "High-rated, eco-friendly option",
      available: true,
    },
    {
      id: "VH-003",
      type: "Sedan",
      name: "Hyundai Elantra",
      seats: 4,
      fuelType: "Petrol",
      pricePerHour: 320,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
      recommended: false,
      available: true,
    },
    {
      id: "VH-004",
      type: "Hatchback",
      name: "Maruti Swift",
      seats: 5,
      fuelType: "Petrol",
      pricePerHour: 280,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
      recommended: false,
      available: true,
    },
    {
      id: "VH-005",
      type: "SUV",
      name: "Tata Nexon EV",
      seats: 5,
      fuelType: "EV",
      pricePerHour: 480,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400",
      recommended: true,
      reason: "Best value EV option",
      available: true,
    },
    {
      id: "VH-006",
      name: "Mahindra XUV700",
      type: "SUV",
      seats: 7,
      fuelType: "Diesel",
      pricePerHour: 600,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
      recommended: false,
      available: true,
    },
  ];

  // Time slots
  const timeSlots = [
    { time: "08:00", price: 1.0, available: true },
    { time: "10:00", price: 1.0, available: true },
    { time: "12:00", price: 1.2, available: true },
    { time: "14:00", price: 1.0, available: true },
    { time: "16:00", price: 1.0, available: true },
    { time: "18:00", price: 1.3, available: true },
    { time: "20:00", price: 1.2, available: true },
  ];

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters.type !== "all" && vehicle.type !== filters.type) return false;
    if (filters.seats !== "all") {
      const seatRange = filters.seats.split("-");
      if (seatRange.length === 1) {
        if (vehicle.seats !== parseInt(seatRange[0])) return false;
      } else {
        if (vehicle.seats < parseInt(seatRange[0]) || vehicle.seats > parseInt(seatRange[1])) return false;
      }
    }
    if (filters.fuelType !== "all" && vehicle.fuelType !== filters.fuelType) return false;
    return true;
  });

  const recommendedVehicles = filteredVehicles.filter((v) => v.recommended);
  const otherVehicles = filteredVehicles.filter((v) => !v.recommended);

  const handleBook = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleConfirmBooking = () => {
    if (selectedVehicle && selectedDate && selectedTimeSlot) {
      navigate("/booking/confirmation", {
        state: {
          vehicle: selectedVehicle,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Car className="text-blue-600" size={36} />
            Book Your Vehicle
          </h1>
          <p className="text-slate-600 text-lg">
            Choose from our fleet with AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Filters</h3>
              </div>

              {/* Vehicle Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Vehicle Type
                </label>
                <div className="space-y-2">
                  {["all", "Sedan", "SUV", "Hatchback"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters({ ...filters, type })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        filters.type === type
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {type === "all" ? "All Types" : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Seats
                </label>
                <div className="space-y-2">
                  {["all", "4", "5", "7"].map((seat) => (
                    <button
                      key={seat}
                      onClick={() => setFilters({ ...filters, seats: seat })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                        filters.seats === seat
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Users size={16} />
                      {seat === "all" ? "All" : `${seat} Seats`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Fuel Type
                </label>
                <div className="space-y-2">
                  {["all", "EV", "Petrol", "Diesel"].map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => setFilters({ ...filters, fuelType: fuel })}
                      className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                        filters.fuelType === fuel
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {fuel === "EV" ? <Zap size={16} /> : <Car size={16} />}
                      {fuel === "all" ? "All Types" : fuel}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFilters({ type: "all", seats: "all", fuelType: "all" })}
                className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Vehicle Listings */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Recommended Section */}
            {recommendedVehicles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-yellow-500" size={24} />
                  <h2 className="text-2xl font-bold text-slate-900">AI Recommended for You</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onBook={handleBook}
                      isRecommended={true}
                      selected={selectedVehicle?.id === vehicle.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Vehicles */}
            {otherVehicles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">All Available Vehicles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onBook={handleBook}
                      isRecommended={false}
                      selected={selectedVehicle?.id === vehicle.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredVehicles.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <Car className="mx-auto text-slate-400 mb-4" size={64} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No vehicles found</h3>
                <p className="text-slate-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Calendar & Time Slots */}
        {selectedVehicle && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="text-blue-600" size={28} />
              Select Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate || ""}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTimeSlot(slot)}
                      disabled={!slot.available}
                      className={`px-4 py-3 rounded-xl border-2 transition ${
                        selectedTimeSlot?.time === slot.time
                          ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold"
                          : slot.available
                          ? "border-slate-200 hover:border-blue-300 bg-white text-slate-700"
                          : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm font-semibold">{slot.time}</div>
                      <div className="text-xs text-slate-500">
                        {slot.price === 1.0 ? "Standard" : `+${((slot.price - 1) * 100).toFixed(0)}%`}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedTimeSlot && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-blue-900">
                          Price: ₹{(selectedVehicle.pricePerHour * selectedTimeSlot.price).toFixed(0)}/hour
                        </div>
                        <div className="text-sm text-blue-700">
                          Base: ₹{selectedVehicle.pricePerHour}/hour × {selectedTimeSlot.price}x multiplier
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={!selectedDate || !selectedTimeSlot}
                className={`flex-1 px-6 py-4 rounded-xl transition font-semibold ${
                  selectedDate && selectedTimeSlot
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle, onBook, isRecommended, selected }) => {
  return (
    <div
      className={`bg-white rounded-2xl border-2 shadow-lg overflow-hidden transition cursor-pointer ${
        selected
          ? "border-blue-600 ring-4 ring-blue-200"
          : "border-slate-200 hover:border-blue-300"
      }`}
      onClick={() => onBook(vehicle)}
    >
      {isRecommended && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 flex items-center gap-2">
          <Sparkles className="text-white" size={16} />
          <span className="text-white font-semibold text-sm">AI Recommended</span>
          <span className="text-white text-xs ml-auto">{vehicle.reason}</span>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{vehicle.name}</h3>
            <p className="text-slate-600">{vehicle.type}</p>
          </div>
          {selected && (
            <CheckCircle className="text-blue-600" size={24} />
          )}
        </div>

        <div className="h-48 bg-slate-200 rounded-xl mb-4 overflow-hidden">
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=Vehicle";
            }}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Users size={16} />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              {vehicle.fuelType === "EV" ? (
                <Zap size={16} className="text-green-600" />
              ) : (
                <Car size={16} />
              )}
              <span>{vehicle.fuelType}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="text-yellow-500 fill-yellow-500" size={16} />
              <span className="font-semibold text-slate-900">{vehicle.rating}</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              ₹{vehicle.pricePerHour}/hr
            </div>
          </div>

          <button
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            onClick={(e) => {
              e.stopPropagation();
              onBook(vehicle);
            }}
          >
            Select Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleBooking;

