// src/pages/AdminDashboard.js

import React from 'react';
import Navbar from '../components/Navbar';
import Location from '../components/Location';


const AdminDashboard = () => {
  return (
    <>
      <Navbar /> {/* ✅ Use the same navbar */}
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome Owner</h2>
        <p style={styles.subtitle}>Manage your tools, customers, and rental requests here.</p>
        <Location/>

        {/* ✅ Later we will add Manage Equipment, View Customers, Rental Requests, Billing Reports */}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f9c440',
    minHeight: '100vh',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
  },
};

export default AdminDashboard;
