import { AlertTriangle, RefreshCw, Home, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RouteErrorFallback = ({ 
  errorType = "generic",
  title,
  message,
  onRetry,
  showHomeButton = true 
}) => {
  const navigate = useNavigate();

  const errorConfig = {
    mapApiFailure: {
      title: "Map Service Unavailable",
      message: "Unable to load map data. Please check your internet connection or try again later.",
      icon: MapPin,
    },
    noRouteFound: {
      title: "No Route Found",
      message: "Unable to find a route between the specified locations. Please try different start and destination points.",
      icon: AlertTriangle,
    },
    trafficDataUnavailable: {
      title: "Traffic Data Unavailable",
      message: "Traffic information is currently unavailable. Routes will be calculated without traffic data.",
      icon: AlertTriangle,
    },
    generic: {
      title: title || "Something Went Wrong",
      message: message || "An error occurred while processing your request. Please try again.",
      icon: AlertTriangle,
    },
  };

  const config = errorConfig[errorType] || errorConfig.generic;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <Icon className="text-red-600" size={48} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {config.title}
          </h2>

          <p className="text-lg text-slate-600 mb-8">
            {config.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
            )}

            {showHomeButton && (
              <button
                onClick={() => navigate("/routes/dashboard")}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Back to Dashboard
              </button>
            )}

            {!onRetry && !showHomeButton && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Reload Page
              </button>
            )}
          </div>

          {/* Suggestions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">Suggestions:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              {errorType === "mapApiFailure" && (
                <>
                  <li>• Check your internet connection</li>
                  <li>• Verify that map services are accessible</li>
                  <li>• Try refreshing the page</li>
                </>
              )}
              {errorType === "noRouteFound" && (
                <>
                  <li>• Verify the start and destination addresses</li>
                  <li>• Try using nearby landmarks or coordinates</li>
                  <li>• Check if the locations are accessible by road</li>
                </>
              )}
              {errorType === "trafficDataUnavailable" && (
                <>
                  <li>• Routes will still be calculated without traffic data</li>
                  <li>• Estimated times may be less accurate</li>
                  <li>• Try again later for real-time traffic updates</li>
                </>
              )}
              {errorType === "generic" && (
                <>
                  <li>• Refresh the page and try again</li>
                  <li>• Check your internet connection</li>
                  <li>• Contact support if the problem persists</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorFallback;

