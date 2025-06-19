import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import Signup from './pages/Signup';
import History from './pages/History';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';

const ConditionalNavbar = () => {
  const location = useLocation();

  // List of routes where Navbar should be hidden
  const hideNavbarRoutes = ['/login', '/signup'];

  // Show Navbar on all other routes
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return shouldShowNavbar ? <Navbar /> : null;
};

function App() {
  const { user } = useContext(UserContext);

  // Avoid rendering app before context is loaded
  if (user === undefined) return null;

  return (
    <BrowserRouter>
      <ToastContainer />
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/customize2" element={<Customize2 />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
