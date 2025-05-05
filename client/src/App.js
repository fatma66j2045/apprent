// src/App.js

import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import Cart from './pages/Cart';
import RentalHistory from './pages/RentalHistory';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddEquipment from './pages/AddEquipment'; 
import ManageRequests from './pages/ManageRequests';
import BillingReport from './pages/BillingReport';
import Profile from './pages/Profile';


function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="customer">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rental-history"
          element={
            <ProtectedRoute role="customer">
              <RentalHistory />
            </ProtectedRoute>
          }
        />

        {/* Protected Owner/Admin Route */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="owner">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

<Route
  path="/add-equipment"
  element={
    <ProtectedRoute role="owner">
      <AddEquipment />
    </ProtectedRoute>
  }
/>
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

<Route path="/manage-requests" element={<ManageRequests />} /> 
<Route path="/billing-report" element={<BillingReport />} />
      </Routes>
    </Router>
  );
}

export default App;
