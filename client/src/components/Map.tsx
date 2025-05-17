import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

// Optional: custom marker icon to fix marker bug
delete L.Icon.Default.prototype._getIconurl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMarker = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const OSMMap = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  return (
    <div>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        style={{ height: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={(lat, lng) => setPosition({ lat, lng })} />
        {position && <Marker position={[position.lat, position.lng]} />}
      </MapContainer>

      {position && (
        <div>
          <p>
            <strong>Latitude:</strong> {position.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {position.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default OSMMap;
