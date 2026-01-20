import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, X, Route, ArrowRight } from "lucide-react";

const PlanRoute = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    stops: [],
    optimizationPreference: "TIME",
    vehicleType: "car",
  });
  const [currentStop, setCurrentStop] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to route visualization with data
    navigate("/routes/visualize", {
      state: {
        routeData: formData,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Route className="text-green-600" size={32} />
            Plan Your Route
          </h1>
          <p className="text-slate-600 text-lg">
            Enter trip details and let AI optimize your route
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Source */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Start Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
              <input
                type="text"
                required
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Enter source address"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stops */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Stops (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                <input
                  type="text"
                  value={currentStop}
                  onChange={(e) => setCurrentStop(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddStop())}
                  placeholder="Add a waypoint"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleAddStop}
                className="px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
            {formData.stops.length > 0 && (
              <div className="space-y-2">
                {formData.stops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-700">{index + 1}.</span>
                      <span className="text-slate-700">{stop}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(index)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Destination <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Enter destination address"
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optimization Preference */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Optimization Preference
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: "TIME", label: "Shortest Time", icon: "⚡", color: "blue" },
                { value: "TRAFFIC", label: "Least Traffic", icon: "🚦", color: "green" },
                { value: "ENERGY", label: "Energy Efficient", icon: "🔋", color: "purple" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, optimizationPreference: option.value })}
                  className={`p-4 border-2 rounded-xl transition text-left ${
                    formData.optimizationPreference === option.value
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-semibold text-slate-900">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "bike", label: "Bike", icon: "🏍️" },
                { value: "car", label: "Car", icon: "🚗" },
                { value: "truck", label: "Truck", icon: "🚚" },
                { value: "van", label: "Van", icon: "🚐" },
              ].map((vehicle) => (
                <button
                  key={vehicle.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, vehicleType: vehicle.value })}
                  className={`p-4 border-2 rounded-xl transition ${
                    formData.vehicleType === vehicle.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="text-3xl mb-2">{vehicle.icon}</div>
                  <div className="font-semibold text-slate-900">{vehicle.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/routes/dashboard")}
              className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              Optimize Route
              <ArrowRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanRoute;

