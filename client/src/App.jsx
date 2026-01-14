import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Cards from './pages/Cards';
import FAQ from './pages/FAQ';
import Simulator from './pages/Simulator';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreditRequest from './pages/CreditRequest';
import CreditRequestMobile from './pages/CreditRequestMobile';
import About from './pages/About';
import Reviews from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CGU from './pages/CGU';
import MentionsLegales from './pages/MentionsLegales';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const ResponsiveCreditRequest = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <CreditRequestMobile /> : <CreditRequest />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/credit-request" element={<ResponsiveCreditRequest />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/confidentialite" element={<PrivacyPolicy />} />
            <Route path="/cgu" element={<CGU />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
