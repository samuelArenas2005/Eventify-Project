/* import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/create" element={<CreateEvent />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App; */
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Navigation from './components/layout/Navigation';
import CreateEvent from './pages/CreateEvents';
import RegisterUser from './pages/RegisterUser';

function App() {
  return (
    <BrowserRouter>
       <Navigation />
       <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/register" element={<RegisterUser />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

