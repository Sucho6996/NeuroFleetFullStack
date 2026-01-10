import { useState } from "react";
import { X } from "lucide-react";

const AddVehicleModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    regNo: "",
    type: "EV",
    fuel: "",
    location: "",
    status: "Idle",
    licenseNo: "",
    engineTemp: "",
    tireWear: "",
    batteryHealth: "",
    fuelEfficiency: "",
    distanceCovered: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 BACKEND-READY PAYLOAD
    const payload = {
      name: form.name.trim(),
      regNo: form.regNo.trim(),
      type: form.type,
      location: form.location.trim(),
      fuel: Number(form.fuel),
      status: form.status || "Idle",
      licenseNo: form.licenseNo.trim() || "",
      engineTemp: form.engineTemp ? parseFloat(form.engineTemp) : undefined,
      tireWear: form.tireWear ? parseFloat(form.tireWear) : undefined,
      batteryHealth: form.batteryHealth ? parseFloat(form.batteryHealth) : undefined,
      fuelEfficiency: form.fuelEfficiency ? parseFloat(form.fuelEfficiency) : undefined,
      distanceCovered: form.distanceCovered ? parseFloat(form.distanceCovered) : undefined,
    };

    onAdd(payload); // FleetInventory will call API

    // Reset form
    setForm({
      name: "",
      regNo: "",
      type: "EV",
      fuel: "",
      location: "",
      status: "Idle",
      licenseNo: "",
      engineTemp: "",
      tireWear: "",
      batteryHealth: "",
      fuelEfficiency: "",
      distanceCovered: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-green-50 border border-green-200 rounded-xl w-full max-w-lg p-6 relative shadow-lg">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-green-800 hover:text-green-900"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-green-900">
          Add New Vehicle
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Vehicle Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="regNo"
            placeholder="Registration Number"
            required
            value={form.regNo}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          >
            <option value="EV">EV</option>
            <option value="FUEL">Fuel</option>
          </select>

          <input
            name="fuel"
            type="number"
            placeholder={form.type === "EV" ? "Battery %" : "Fuel %"}
            required
            value={form.fuel}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="location"
            placeholder="City"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          >
            <option value="Idle">Idle</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <input
            name="licenseNo"
            placeholder="Driver License Number"
            value={form.licenseNo}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="engineTemp"
            type="number"
            placeholder="Engine Temperature (°C)"
            value={form.engineTemp}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="tireWear"
            type="number"
            placeholder="Tire Wear (%)"
            value={form.tireWear}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="batteryHealth"
            type="number"
            placeholder="Battery Health (%)"
            value={form.batteryHealth}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="fuelEfficiency"
            type="number"
            placeholder="Fuel Efficiency (km/l)"
            value={form.fuelEfficiency}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <input
            name="distanceCovered"
            type="number"
            placeholder="Distance Covered (km)"
            value={form.distanceCovered}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-green-200 bg-green-100 text-green-900"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            Add Vehicle
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
