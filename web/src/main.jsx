import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Openlayout from "./layout/openlayout";
import LandingPage from "./pages/landingPage"
import Register from "./pages/register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Homelayout from "./layout/homelayout";
import NotFoundPage from "./pages/NotFoundPage";


// import ProtectedRoute from "./utils/ProtectedRoute.jsx";  

const router = createBrowserRouter([
  {
    path: "/",
    element: <Openlayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ]
  },
  {
    path: "/app",
    element: <Homelayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);