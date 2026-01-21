import { MapPin, Pencil, Trash2, Eye } from "lucide-react";
import TelemetryBar from "./TelemetryBar";

const VehicleCard = ({ vehicle, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 space-y-3 relative shadow-sm hover:shadow-md transition-shadow">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-900">{vehicle.name}</h3>
          <p className="text-xs text-slate-500">{vehicle.number}</p>
        </div>

        <div className="flex gap-2.5">
          {onView && (
            <button
              onClick={onView}
              className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-full p-1 transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
          )}
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full p-1 transition-colors"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full p-1 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={14} />
        {vehicle.location.city}
      </div>

      {/* Telemetry */}
      {vehicle.battery !== null && (
        <TelemetryBar label="Battery" value={vehicle.battery} color="bg-green-500" />
      )}
      {vehicle.fuel !== null && (
        <TelemetryBar label="Fuel" value={vehicle.fuel} color="bg-yellow-500" />
      )}

      {/* Speed */}
      <p className="text-xs text-slate-600">
        Speed: <span className="font-medium">{vehicle.speed} km/h</span>
      </p>
    </div>
  );
};

export default VehicleCard;
