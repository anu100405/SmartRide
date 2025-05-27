import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import MainLayout from "./pages/MainLayout";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/theme-provider";
import RideRequest from "./components/ride-request";
import Ride from "./components/Ride";
import { UserProvider } from "./context/UserContext";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <RideRequest />,
      },
      {
        path: "/ride",
        element: <Ride />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const App = () => {

  return (
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div>
          <RouterProvider router={appRouter} />
        </div>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App;
