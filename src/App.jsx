import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ComingSoon from './pages/ComingSoon';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Team from './pages/Company/Team';
import Contact from './pages/Company/Contact';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;