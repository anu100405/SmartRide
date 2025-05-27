import { useEffect, useState } from "react";
import OSMMap from "./Map";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import axios from "axios";

const RideRequest = () => {
  const [formData, setFormData] = useState({
    pickup: "",
    destination: "",
    shared: false,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useUser();

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      toast.error("Login to continue...");
      navigate("/login", {
        replace: true,
      });
    }
  }, []);

  const bookCabHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pickupRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          formData.pickup
        )}&format=json&limit=1`
      );
      const pickupData = await pickupRes.json();

      const destRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          formData.destination
        )}&format=json&limit=1`
      );
      const destData = await destRes.json();

      if (pickupData.length === 0 || destData.length === 0) {
        throw new Error("Location not found");
      }

      const pickupLat = parseFloat(pickupData[0].lat);
      const pickupLong = parseFloat(pickupData[0].lon);
      const destLat = parseFloat(destData[0].lat);
      const destLong = parseFloat(destData[0].lon);

      if (formData.shared) {
        // New POST request to actual ride booking endpoint
        const backendRes = await axios.post(
          "http://localhost:5000/rides/request-ride",
          {
            userId: user?._id, // hardcoded or from auth context
            from: { lat: pickupLat, lon: pickupLong },
            to: { lat: destLat, lon: destLong },
          },
          {
            withCredentials: true,
          }
        );

        toast.success(
          `Cab booked! Fare: ₹${backendRes?.data?.fare}, ETA: ${backendRes?.data?.eta} mins`
        );

        navigate("/ride", {
          replace: true,
          state: {
            pickupName: formData.pickup,
            destinationName: formData.destination,
            fare: backendRes?.data?.fare,
            path: backendRes?.data?.path,
            rideId: backendRes?.data?.rideId,
          },
        });
      } else {
        const res = await axios.get(
          `http://localhost:5000/rides/book-ride?fromLat=${pickupLat}&fromLon=${pickupLong}&toLat=${destLat}&toLon=${destLong}`,
          {
            withCredentials: true,
          }
        );

        navigate("/ride", {
          replace: true,
          state: {
            pickupName: formData.pickup,
            destinationName: formData.destination,
            fare: res.data?.fare,
            path: res.data?.path,
            rideId: null,
          },
        });
      }
    } catch (error: any) {
      console.error("Error booking cab:", error);
      toast.error("Booking failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div>
        <OSMMap />
      </div>
      <div className="px-10 py-3">
        <h2 className="font-bold text-lg">Enter data to book cab</h2>
        <Separator />
        <form className="space-y-2 mt-10" onSubmit={bookCabHandler}>
          <div>
            <Label>Pickup</Label>
            <Input
              type="text"
              placeholder="E.g Clock Tower"
              name="pickup"
              value={formData.pickup}
              onChange={onInputChangeHandler}
            />
          </div>
          <div>
            <Label>Destination</Label>
            <Input
              type="text"
              placeholder="E.g Clement Town"
              name="destination"
              value={formData.destination}
              onChange={onInputChangeHandler}
            />
          </div>
          <div className="flex gap-4">
            <Input
              className="w-5 h-5"
              type="checkbox"
              id="shared"
              onChange={() =>
                setFormData({ ...formData, shared: !formData.shared })
              }
            />
            <Label htmlFor="shared">Want to Share?</Label>
          </div>
          <div>
            {loading ? (
              <>
                <Button disabled>
                  <Loader2 className="animate-spin h-4 w-4" /> Please Wait...
                </Button>
              </>
            ) : (
              <>
                <Button type="submit">Book</Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RideRequest;
