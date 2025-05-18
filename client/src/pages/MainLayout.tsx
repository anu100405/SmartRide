import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import Map from "../components/Map";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Map />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
