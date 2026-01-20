import { useState } from "react";
import { X } from "lucide-react";

const EditVehicleModal = ({ vehicle, onClose, onSave }) => {
  const [fuel, setFuel] = useState(vehicle.fuel ?? vehicle.battery ?? 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(vehicle.number, Number(fuel));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">

        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          Edit {vehicle.type === "EV" ? "Battery" : "Fuel"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full p-2 border rounded bg-green-100 border border-green-300 text-green-900"
            placeholder="Percentage"
            required
          />

          <button className="w-full bg-green-600 text-white py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;
