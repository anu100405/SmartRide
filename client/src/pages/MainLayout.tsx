import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { connectSocket, disconnectSocket } from "@/socket";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  return (
    <div className="h-[200vh]">
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
