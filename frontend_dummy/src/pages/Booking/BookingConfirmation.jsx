import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Calendar, Clock, MapPin, Car, Users, Zap, ArrowLeft, Download } from "lucide-react";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, date, timeSlot } = location.state || {};

  const [bookingId] = useState(`BK-${Date.now()}`);

  useEffect(() => {
    if (!vehicle || !date || !timeSlot) {
      navigate("/booking");
    }
  }, [vehicle, date, timeSlot, navigate]);

  if (!vehicle || !date || !timeSlot) {
    return null;
  }

  const totalPrice = (vehicle.pricePerHour * timeSlot.price).toFixed(0);
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-green-500 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 text-lg">
            Your booking has been successfully confirmed. Booking ID: <span className="font-bold text-green-600">{bookingId}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Booking Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Car className="text-green-600" size={20} />
                Vehicle Details
              </h3>
              <div className="space-y-2 pl-7">
                <div>
                  <span className="text-slate-600">Vehicle:</span>
                  <span className="font-semibold text-slate-900 ml-2">{vehicle.name}</span>
                </div>
                <div>
                  <span className="text-slate-600">Type:</span>
                  <span className="font-semibold text-slate-900 ml-2">{vehicle.type}</span>
                </div>
                <div>
                  <span className="text-slate-600">Vehicle ID:</span>
                  <span className="font-semibold text-slate-900 ml-2">{vehicle.id}</span>
                </div>
                <div className="flex items-center gap-4">
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
              </div>
            </div>

            {/* Booking Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="text-green-600" size={20} />
                Booking Information
              </h3>
              <div className="space-y-2 pl-7">
                <div>
                  <span className="text-slate-600">Date:</span>
                  <span className="font-semibold text-slate-900 ml-2">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-600" />
                  <span className="text-slate-600">Time:</span>
                  <span className="font-semibold text-slate-900 ml-2">{timeSlot.time}</span>
                </div>
                <div>
                  <span className="text-slate-600">Booking ID:</span>
                  <span className="font-semibold text-green-600 ml-2">{bookingId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Pricing Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600">Base Price (per hour):</span>
              <span className="font-semibold text-slate-900">₹{vehicle.pricePerHour}</span>
            </div>
            {timeSlot.price !== 1.0 && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <span className="text-slate-600">Time Multiplier ({timeSlot.price}x):</span>
                <span className="font-semibold text-slate-900">
                  +{((timeSlot.price - 1) * 100).toFixed(0)}%
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-t-2 border-slate-300">
              <span className="text-xl font-bold text-slate-900">Total Price (per hour):</span>
              <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Important Information</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Please arrive 10 minutes before your scheduled time</li>
            <li>• Bring a valid driver's license and ID proof</li>
            <li>• Vehicle will be available at the selected time slot</li>
            <li>• Cancellation is allowed up to 24 hours before booking</li>
            <li>• Contact support for any changes or queries</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download/Print
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

