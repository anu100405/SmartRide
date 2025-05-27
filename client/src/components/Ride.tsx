import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import L from "leaflet";
import { useUser } from "@/context/UserContext";
import getSocket from "@/socket";

const Ride = () => {
  const location = useLocation();
  const [rideData, setRideData] = useState(location.state);
  const [sharedCount, setSharedCount] = useState(1);
  const [sharedPickups, setSharedPickups] = useState<LatLngTuple[]>([]);
  const [sharedDestinations, setSharedDestinations] = useState<LatLngTuple[]>(
    []
  );
  const [usernames, setUsernames] = useState<string[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  const socket = getSocket();

  const pickupIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [0, -40],
  });

  const sharedPickupIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [0, -40],
  });

  const destinationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [0, -40],
  });

  useEffect(() => {
    if (!user) {
      toast.error("User not found, login first");
      navigate("/login", { replace: true });
    }
  }, []);

  // Join the ride room using rideId
  useEffect(() => {
    if (!socket.connected) socket.connect();
    if (rideData?.rideId) {
      socket.emit("joinRide", rideData.rideId);
    }
  }, [rideData]);

  useEffect(() => {
    if (location.state) {
      setRideData(location.state);
      setSharedCount(1);
      setSharedPickups([]);
      setUsernames([]);
    }
  }, [location.state]);

  useEffect(() => {
    const handleRideUpdate = (data: any) => {
      if (!rideData?.rideId || data.rideId !== rideData.rideId) return;

      toast.info(data.message || "A shared rider joined!");

      if (data.newPickup) {
        const pickupCoords: LatLngTuple = [
          data.newPickup.lat,
          data.newPickup.lon,
        ];
        setSharedPickups((prev) =>
          prev.some(
            ([lat, lon]) => lat === pickupCoords[0] && lon === pickupCoords[1]
          )
            ? prev
            : [...prev, pickupCoords]
        );
      }

      if (data.newDestination) {
        const destCoords: LatLngTuple = [
          data.newDestination.lat,
          data.newDestination.lon,
        ];
        setSharedDestinations((prev) =>
          prev.some(
            ([lat, lon]) => lat === destCoords[0] && lon === destCoords[1]
          )
            ? prev
            : [...prev, destCoords]
        );
      }

      setSharedCount(data.riders);
      setUsernames(data.usernames || []);
      setRideData((prev: any) =>
        prev
          ? {
            ...prev,
            fare: data.fare ?? prev.fare,
            path: data.path ?? prev.path,
            estimatedTime: data.eta ?? prev.estimatedTime,
            pickupName: data.newPickup?.name ?? prev.pickupName,
            destinationName:
              data.newDestination?.name ?? prev.destinationName,
          }
          : prev
      );
    };

    socket.on("rideUpdated", handleRideUpdate);
    return () => {
      socket.off("rideUpdated", handleRideUpdate);
    };
  }, [rideData]);

  if (!rideData) return <p>No ride data provided.</p>;

  const { fare, path, pickupName, destinationName } = rideData;
  const center: LatLngTuple = useMemo(() => [path[0].lat, path[0].lon], [path]);
  const polyline: LatLngTuple[] = useMemo(
    () => path.map((p: any) => [p.lat, p.lon]),
    [path]
  );

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-5 py-20">
        <h2 className="text-2xl font-bold mb-4">Ride Summary</h2>
        <p>
          <strong>Pickup:</strong> {pickupName}
        </p>
        <p>
          <strong>Destination:</strong> {destinationName}
        </p>
        <p>
          <strong>Fare:</strong> ₹{fare.toFixed(2)}
        </p>
        <p>
          <strong>Shared Riders:</strong> {sharedCount}
        </p>
        {usernames.length > 1 && (
          <p className="mt-2 text-sm text-gray-600">
            Sharing with: {usernames.join(", ")}
          </p>
        )}
        {sharedPickups.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Shared Pickups:</p>
            <ul className="text-sm list-disc list-inside text-gray-600">
              {sharedPickups.map(([lat, lon], index) => (
                <li key={index}>
                  Lat: {lat.toFixed(5)}, Lon: {lon.toFixed(5)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {sharedDestinations.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Shared Destinations:</p>
            <ul className="text-sm list-disc list-inside text-gray-600">
              {sharedDestinations.map(([lat, lon], index) => (
                <li key={index}>
                  Lat: {lat.toFixed(5)}, Lon: {lon.toFixed(5)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2 h-[500px] md:h-full">
        <MapContainer
          center={center}
          zoom={13}
          className="w-full h-full rounded-lg"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={polyline} color="blue" />

          {/* Original Pickup */}
          <Marker position={polyline[0]} icon={pickupIcon}>
            <Popup>Your Pickup</Popup>
          </Marker>

          {/* Shared Pickups */}
          {sharedPickups.map((coord, index) => (
            <Marker
              key={`pickup-${index}`}
              position={coord}
              icon={sharedPickupIcon}
            >
              <Popup>Shared Pickup {index + 1}</Popup>
            </Marker>
          ))}

          {/* Shared Destinations */}
          {sharedDestinations.map((coord, index) => (
            <Marker
              key={`dest-${index}`}
              position={coord}
              icon={destinationIcon}
            >
              <Popup>Shared Destination {index + 1}</Popup>
            </Marker>
          ))}

          {/* Final Destination */}
          <Marker
            position={polyline[polyline.length - 1]}
            icon={destinationIcon}
          >
            <Popup>Your Destination</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Ride;
