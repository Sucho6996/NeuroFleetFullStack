import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getVehicleByRegNo } from "../services/fleetManagerApis";

const ShowVehicle = ({ regNo, onBack }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [regNo]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await getVehicleByRegNo(regNo);
      setVehicle(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load vehicle details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
          <p className="mt-6 text-xl text-slate-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <p className="text-red-600">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 className="text-3xl font-bold text-slate-900 mb-6">Vehicle Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vehicle Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Vehicle Information
          </h3>
          <div className="space-y-2 text-slate-700">
            <p><strong>Registration No:</strong> {vehicle.regNo}</p>
            <p><strong>Name:</strong> {vehicle.name}</p>
            <p><strong>Type:</strong> {vehicle.type}</p>
            <p><strong>Status:</strong> {vehicle.status}</p>
            <p><strong>Fuel:</strong> {vehicle.fuel}%</p>
            <p><strong>Location:</strong> {vehicle.location}</p>
            {vehicle.licenseNo && (
              <p><strong>License No:</strong> {vehicle.licenseNo}</p>
            )}
            {vehicle.distanceCovered !== undefined && (
              <p><strong>Distance Covered:</strong> {vehicle.distanceCovered} km</p>
            )}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Vehicle Health
          </h3>
          <div className="space-y-2 text-slate-700">
            {vehicle.engineTemp !== undefined && (
              <p><strong>Engine Temperature:</strong> {vehicle.engineTemp} °C</p>
            )}
            {vehicle.tireWear !== undefined && (
              <p><strong>Tire Wear:</strong> {vehicle.tireWear}%</p>
            )}
            {vehicle.batteryHealth !== undefined && (
              <p><strong>Battery Health:</strong> {vehicle.batteryHealth}%</p>
            )}
            {vehicle.fuelEfficiency !== undefined && (
              <p><strong>Fuel Efficiency:</strong> {vehicle.fuelEfficiency} km/l</p>
            )}
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Driver Information
          </h3>
          <div className="space-y-2 text-slate-700">
            {vehicle.driverName ? (
              <>
                <p><strong>Name:</strong> {vehicle.driverName}</p>
                {vehicle.driverContact && (
                  <p><strong>Contact:</strong> {vehicle.driverContact}</p>
                )}
              </>
            ) : (
              <p className="text-slate-500">No driver assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowVehicle;
