import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import MainLayout from "./pages/MainLayout";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/theme-provider";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <RouterProvider router={appRouter} />
      </div>
    </ThemeProvider>
  );
};

export default App;
