const RouteOptions = ({ routes, onSelect }) => {
  return (
    <div className="space-y-4">
      {routes.map(route => (
        <div
          key={route.id}
          onClick={() => onSelect(route.id)}
          className={`cursor-pointer rounded-xl border p-4 transition
            ${
              route.active
                ? "border-green-600 bg-green-100"
                : "border-green-200 bg-green-50 hover:bg-green-100"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-green-900">
              {route.name}
            </h4>

            {route.recommended && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-600 text-white">
                Recommended
              </span>
            )}
          </div>


          <div className="mt-2 text-sm text-green-800 space-y-1">
            <p>ETA: <strong>{route.eta}</strong></p>
            <p>Distance: {route.distance}</p>
            <p>Energy: {route.energy}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteOptions;
