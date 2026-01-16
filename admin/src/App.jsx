import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import KYCVerification from './pages/KYCVerification';
import CardRequests from './pages/CardRequests';
import UserDetails from './pages/UserDetails';
import ManageTransactions from './pages/ManageTransactions';
import WalletManagement from './pages/WalletManagement';
import LoanManagement from './pages/LoanManagement';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="kyc" element={<KYCVerification />} />
            <Route path="cards" element={<CardRequests />} />
            <Route path="wallets" element={<WalletManagement />} />
            <Route path="loans" element={<LoanManagement />} />
            <Route path="transactions/user/:userId" element={<ManageTransactions />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
