import { MapPin, Pencil, Trash2, Eye } from "lucide-react";
import TelemetryBar from "./TelemetryBar";

const VehicleCard = ({ vehicle, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-green-100 border border-green-400 rounded-xl p-4 space-y-3 relative">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-green-800">{vehicle.name}</h3>
          <p className="text-xs text-gray-800">{vehicle.number}</p>
        </div>

        <div className="flex gap-3">
          {onView && (
            <button onClick={onView} className="text-green-600 hover:text-green-800" title="View Details">
              <Eye size={18} />
            </button>
          )}
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800" title="Edit">
            <Pencil size={18} />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800" title="Delete">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
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
      <p className="text-xs text-gray-700">
        Speed: <span className="font-medium">{vehicle.speed} km/h</span>
      </p>
    </div>
  );
};

export default VehicleCard;
