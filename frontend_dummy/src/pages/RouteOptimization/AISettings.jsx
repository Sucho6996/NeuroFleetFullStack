import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save, MapPin, Gauge, AlertTriangle, Key } from "lucide-react";

const AISettings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    mapsApiKey: "********************",
    etaAccuracy: 85,
    trafficWeight: 70,
    energyWeight: 60,
    reroutingThreshold: 500,
    autoReroute: true,
    trafficDataRefresh: 5,
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    // In real app, this would save to backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Settings className="text-green-600" size={32} />
                AI Settings & Configuration
              </h1>
              <p className="text-slate-600 text-lg">Configure AI behavior and route optimization parameters</p>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Key className="text-green-600" size={20} />
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Maps API Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.mapsApiKey}
                  onChange={(e) => setSettings({ ...settings, mapsApiKey: e.target.value })}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                >
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Model Tuning */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Gauge className="text-green-600" size={20} />
            Model Tuning
          </h2>
          <div className="space-y-6">
            {/* ETA Accuracy */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">ETA Accuracy</label>
                <span className="text-sm font-bold text-slate-900">{settings.etaAccuracy}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={settings.etaAccuracy}
                onChange={(e) => setSettings({ ...settings, etaAccuracy: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Traffic Weight */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Traffic Weight</label>
                <span className="text-sm font-bold text-slate-900">{settings.trafficWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.trafficWeight}
                onChange={(e) => setSettings({ ...settings, trafficWeight: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Energy Weight */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Energy Efficiency Weight</label>
                <span className="text-sm font-bold text-slate-900">{settings.energyWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.energyWeight}
                onChange={(e) => setSettings({ ...settings, energyWeight: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Routing Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-green-600" size={20} />
            Routing Thresholds
          </h2>
          <div className="space-y-4">
            {/* Rerouting Threshold */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Re-routing Threshold (meters)
              </label>
              <input
                type="number"
                value={settings.reroutingThreshold}
                onChange={(e) => setSettings({ ...settings, reroutingThreshold: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Distance deviation before triggering re-routing
              </p>
            </div>

            {/* Auto Re-route */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-slate-700">Auto Re-route</label>
                <p className="text-xs text-slate-500 mt-1">
                  Automatically suggest re-routing when deviation detected
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoReroute: !settings.autoReroute })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.autoReroute ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.autoReroute ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Traffic Data Refresh */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Traffic Data Refresh Rate (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.trafficDataRefresh}
                onChange={(e) => setSettings({ ...settings, trafficDataRefresh: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/routes/dashboard")}
            className="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition font-semibold"
          >
            Cancel
          </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Save size={20} />
              Save Settings
            </button>
        </div>
      </div>
    </div>
  );
};

export default AISettings;

