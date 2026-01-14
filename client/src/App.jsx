import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Cards from './pages/Cards';
import FAQ from './pages/FAQ';
import Simulator from './pages/Simulator';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import CreditRequest from './pages/CreditRequest';
import About from './pages/About';
import './index.css';

function App() {
  return (
    <Router>
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
            <Route path="/credit-request" element={<CreditRequest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
