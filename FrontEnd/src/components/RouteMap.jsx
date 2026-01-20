import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
const trafficZones = [
  {
    id: 1,
    center: [23.2628, 77.4168],
    radius: 400,
    level: "HIGH",
    color: "#dc2626", // red
  },
  {
    id: 2,
    center: [23.2610, 77.4145],
    radius: 300,
    level: "MEDIUM",
    color: "#f97316", // orange
  },
];

/* ---------- Marker Icons ---------- */
const startIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/* ---------- Component ---------- */
const RouteMap = ({ routes }) => {
  if (!routes || routes.length === 0) return null;

  const start = routes[0].path[0];
  const end = routes[0].path[routes[0].path.length - 1];

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden border border-green-200">
      <MapContainer
        center={start}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start Marker */}
        <Marker position={start} icon={startIcon}>
          <Popup>Start Location</Popup>
        </Marker>

        {/* End Marker */}
        <Marker position={end} icon={endIcon}>
          <Popup>Destination</Popup>
        </Marker>

        {/* Traffic Zones */}
          {trafficZones.map(zone => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.25,
              }}
            >
              <Popup>
                <strong>{zone.level} Traffic Zone</strong>
              </Popup>
            </Circle>
          ))}


        {/* Route Polylines */}
        {routes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.path}
            pathOptions={{
              color: route.color,
              weight: route.active ? 6 : 3,
              opacity: route.active ? 1 : 0.35,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteMap;
