import React, { useState, useEffect } from "react";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  login as apilogin,
  logout as apilogout,
  getUser
} from "./API/api";

import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditPerfilPage from "./pages/Dashboard/EditPerfilPage/EditPerfilPage";
import RegisterUser from "./pages/RegisterUser";
import CreateEventPage from "./pages/CreateEvent/CreateEventPage";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import Analytics from "./pages/Analytics/Analytics";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import SearchPage from "./pages/SearchEvent/SearchPage.jsx";
import ScrollToTop from "./components/UI/ScrollTop/ScrollToTop";

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const success = await apilogin(email, password);
      if (success) {
        const userData = await getUser(); // ← Añade await aquí
        setUser(userData);
      }
      console.log("success:", success);
      return success;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleLogOut = async () => {
    const success = await apilogout();
    if (!success) {
      console.log("Logout failed");
      return false;
    }
    console.log("Logout successful");
    setUser(null);
    return success;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <Navigation user={user} logout={handleLogOut} />
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
              <Login login={handleLogin} />
            </>
          }
        />
        <Route
          path="/searchPage"
          element={
            <>
              <SearchPage />
            </>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
        //Aqui van las rutas que solo dependen del usuario
        <Route
          element={<ProtectedRoute isAllowed={!!user} loading={loading} />}
        >
          <Route
            path="/dashboard"
            element={
              <>
                <Dashboard user = {user}/>
              </>
            }
          />
          <Route
            path="/editProfile"
            element={
              <>
                <EditPerfilPage />
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
            <ProtectedRoute
              isAllowed={user ? user.is_admin : false}
              loading={loading}
              redirectTo="/dashboard"
            >
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
