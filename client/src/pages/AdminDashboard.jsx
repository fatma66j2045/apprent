import React from 'react';
import Navbar from '../components/Navbar';
import useLocation from '../utils/useLocation';

const AdminDashboard = () => {
  const { placeInfo, error } = useLocation();

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Welcome Owner</h2>
        <p style={styles.subtitle}>Manage your tools, customers, and rental requests here.</p>

        {error && <p style={styles.error}>{error}</p>}
        {placeInfo && (
          <div style={styles.locationBox}>
            <p><strong>City:</strong> {placeInfo.city}</p>
            <p><strong>Region:</strong> {placeInfo.region}</p>
            <p><strong>Country:</strong> {placeInfo.country}</p>
          </div>
        )}
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
  locationBox: {
    marginTop: '30px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
    textAlign: 'left',
    color: '#333',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};

export default AdminDashboard;
