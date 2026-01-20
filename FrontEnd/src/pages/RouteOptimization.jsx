import { useEffect, useState } from "react";
import RouteMap from "../components/RouteMap";
import RouteOptions from "../components/RouteOptions";

const RouteOptimization = () => {
  const [routes, setRoutes] = useState([
  {
    id: 1,
    name: "Fastest Route",
    mode: "TIME",
    color: "#16a34a",
    eta: "14 mins",
    etaValue: 14,
    distance: "5.1 km",
    distanceValue: 5.1,
    energy: "Medium",
    energyValue: 2,
    active: true,
    recommended: false,
    path: [
      [23.2599, 77.4126],   // Start
      [23.2635, 77.4162],   // Direct mid
      [23.2650, 77.4200],   // End
    ],
  },
  {
    id: 2,
    name: "Energy Efficient",
    mode: "ENERGY",
    color: "#2563eb",
    eta: "18 mins",
    etaValue: 18,
    distance: "5.8 km",
    distanceValue: 5.8,
    energy: "Low",
    energyValue: 1,
    active: false,
    recommended: false,
    path: [
      [23.2599, 77.4126],
      [23.2580, 77.4140],
      [23.2605, 77.4180],
      [23.2650, 77.4200],
    ],
  },
  {
    id: 3,
    name: "Traffic Avoidance",
    mode: "TRAFFIC",
    color: "#f97316",
    eta: "16 mins",
    etaValue: 16,
    distance: "6.0 km",
    distanceValue: 6.0,
    energy: "High",
    energyValue: 3,
    active: false,
    recommended: false,
    path: [
      [23.2599, 77.4126],
      [23.2625, 77.4135],
      [23.2640, 77.4165],
      [23.2630, 77.4185],
      [23.2650, 77.4200],
    ],
  },
]);


const scoreRoute = (route) => {
  return (
    route.etaValue * 0.5 +
    route.distanceValue * 0.3 +
    route.energyValue * 0.2
  );
};
useEffect(() => {
  const scoredRoutes = routes.map(r => ({
    ...r,
    score: scoreRoute(r),
  }));

  const bestRoute = scoredRoutes.reduce((best, r) =>
    r.score < best.score ? r : best
  );

  setRoutes(
    scoredRoutes.map(r => ({
      ...r,
      active: r.id === bestRoute.id,
      recommended: r.id === bestRoute.id,
    }))
  );
}, []);


  const selectRoute = (id) => {
    setRoutes(routes.map(r => ({
      ...r,
      active: r.id === id,
    })));
  };

  const activeRouteId = routes.find(r => r.active)?.id;

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-semibold text-green-900">
        AI Route Optimization
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <RouteMap routes={routes} />
        </div>

        <RouteOptions
          routes={routes}
          onSelect={selectRoute}
        />
      </div>
    </div>
  );
};

export default RouteOptimization;
