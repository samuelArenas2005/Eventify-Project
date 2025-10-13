import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './pages/Events';
import Navigation from './components/layout/Navigation';

import CreateEvent from './pages/CreateEvents';
import RegisterUser from './pages/RegisterUser';

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
              <Events />
            </>
          }
        />
        <Route
          path="/create"
          element={
            <>
              <Navigation />
              <CreateEvent />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

