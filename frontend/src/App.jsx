import React, { useState, useEffect} from 'react';

import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navigation from './components/layout/Navigation';
import Landing from './pages/Landing/Landing'
import Login from './pages/login'
import Dashboard from './pages/Dashboard/Dashboard';
import RegisterUser from './pages/RegisterUser';
import CreateEventPage from './pages/CreateEvent/CreateEventPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';


function App() {

  const [user, setUser] = useState(null)
    //Codigo donde se hace la peticion

  const login = () => {
    setUser({
      id: 1,
      name: 'Jhon'
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Navigation user={user} logout={logout} login={login}/>
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

