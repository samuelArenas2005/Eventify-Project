import React from 'react';

import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navigation from './components/layout/Navigation';
import Landing from './pages/Landing/Landing'
import Login from './pages/login'
import Dashboard from './pages/Dashboard/Dashboard';
import RegisterUser from './pages/RegisterUser';
import CreateEventPage from './pages/CreateEvent/CreateEventPage';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navigation />
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
            <>
               <Navigation />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/createEvent"
          element={
            <>
               <Navigation />
              <CreateEventPage />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

