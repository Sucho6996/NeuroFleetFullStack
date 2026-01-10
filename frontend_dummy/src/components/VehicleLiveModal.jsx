import React from "react";
import { X } from "lucide-react";

const VehicleLiveModal = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-600 hover:text-slate-900"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Vehicle Live Tracking
        </h2>

        <div className="space-y-4 mb-4">
          <p className="text-slate-700">
            <strong>Reg No:</strong> {vehicle.regNo}
          </p>
          <p className="text-slate-700">
            <strong>Fuel:</strong> {vehicle.liveFuel}%
          </p>
          <p className="text-slate-700">
            <strong>Speed:</strong> {vehicle.liveSpeed} km/h
          </p>
        </div>

        {vehicle.liveLat && vehicle.liveLon && (
          <iframe
            title="vehicle-map"
            src={`https://maps.google.com/maps?q=${vehicle.liveLat},${vehicle.liveLon}&z=15&output=embed`}
            className="w-full h-96 rounded-lg border border-slate-200"
          />
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VehicleLiveModal;
