import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./Auth/Login.jsx";
import Dash from "./Dash.jsx";
import Home from "./Home.jsx";
import { Posts } from "./Posts.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import User from "./User.jsx";

let route = createBrowserRouter([
  {
    path: "/signup",
    Component: Login,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/dashboard/:id",
        Component: Dash,
      },
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/home/posts",
        Component: Posts,
      },
      {
        path: "/home/user/:id",
        Component: User,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={route}>
      <App />
    </RouterProvider>
  </StrictMode>
);
