const TelemetryBar = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex justify-between text-xs text-green-700 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 bg-green-100 rounded-full">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default TelemetryBar;
