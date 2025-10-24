import React, { useState, useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navigation from "./components/layout/Navigation";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard/Dashboard";
import RegisterUser from "./pages/RegisterUser";
import CreateEventPage from "./pages/CreateEvent/CreateEventPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  const [user, setUser] = useState(null);

  const login = () => {
    const userData = { id: 1, name: "Jhon", is_admin: false };
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Navigation user={user} logout={logout} login={login} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Landing />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <RegisterUser />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />
        //Aqui van las rutas que solo dependen del usuario
        <Route element={<ProtectedRoute isAllowed={!!user} />}>
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard />
              </>
            }
          />
          <Route
            path="/createEvent"
            element={
              <>
                <CreateEventPage />
              </>
            }
          />
        </Route>
        <Route
          path={"/analytics"}
          element={
            <ProtectedRoute isAllowed={user ? user.is_admin : false} redirectTo="/dashboard">
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
