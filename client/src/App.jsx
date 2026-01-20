import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Services from './pages/Services';
import Cards from './pages/Cards'; // Public Cards page
import FAQ from './pages/FAQ';
import Simulator from './pages/Simulator';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/dashboard/Accounts';
import CardsDashboard from './pages/dashboard/Cards'; // Dashboard Cards page
import DocumentsDashboard from './pages/dashboard/Documents';
import Transfers from './pages/dashboard/Transfers';
import Deposit from './pages/dashboard/Deposit';
import History from './pages/dashboard/History';
import Credits from './pages/dashboard/Credits';
import Support from './pages/dashboard/Support';
import Settings from './pages/dashboard/Settings';
import Beneficiaries from './pages/dashboard/Beneficiaries';
import KycVerification from './pages/dashboard/KycVerification';
import CreditRequest from './pages/CreditRequest';
import CreditRequestMobile from './pages/CreditRequestMobile';
import About from './pages/About';
import Reviews from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CGU from './pages/CGU';
import MentionsLegales from './pages/MentionsLegales';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import EmailVerificationPending from './pages/EmailVerificationPending';
import EmailVerificationSuccess from './pages/EmailVerificationSuccess';
import AuthActionHandler from './pages/AuthActionHandler';
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

const PublicLayout = ({ children }) => {
  return (
    <div className="public-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
      <Route path="/cards" element={<PublicLayout><Cards /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
      <Route path="/simulator" element={<PublicLayout><Simulator /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/credit-request" element={<PublicLayout><ResponsiveCreditRequest /></PublicLayout>} />
      <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
      <Route path="/confidentialite" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/cgu" element={<PublicLayout><CGU /></PublicLayout>} />
      <Route path="/mentions-legales" element={<PublicLayout><MentionsLegales /></PublicLayout>} />
      <Route path="/email-verification-pending" element={<EmailVerificationPending />} />
      <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
      <Route path="/auth/action" element={<AuthActionHandler />} />

      {/* Dashboard Private Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Dashboard sub-pages */}
        <Route path="accounts" element={<Accounts />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="deposit" element={<Deposit />} />
        <Route path="cards" element={<CardsDashboard />} />
        <Route path="credits" element={<Credits />} />
        <Route path="history" element={<History />} />
        <Route path="beneficiaries" element={<Beneficiaries />} />
        <Route path="documents" element={<DocumentsDashboard />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
        <Route path="kyc" element={<KycVerification />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}

export default App;
