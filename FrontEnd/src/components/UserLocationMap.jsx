import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserLocationMap = () => {
  useEffect(() => {
    const map = L.map("user-map").setView([22.7196, 75.8577], 13); // Indore example

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([22.7196, 75.8577])
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="user-map"
      className="w-full h-[300px] rounded-xl overflow-hidden border border-white/20"
    />
  );
};

export default UserLocationMap;
