
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Store/usersSlice'; 

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    navigate('/');      // Redirect to login
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Tools and Heavy Equipment Rental Platform</h2>

      <div style={styles.navLinks}>
        {user?.role === 'customer' && (
          <>
            <span style={styles.link} onClick={() => navigate('/home')}>Home</span>
            <span style={styles.link} onClick={() => navigate('/cart')}>Cart</span>
            <span style={styles.link} onClick={() => navigate('/rental-history')}>Rental History</span>
            <span style={styles.link} onClick={() => navigate('/profile')}>Profile</span>
          </>
        )}

        {user?.role === 'owner' && (
          <>
            <span style={styles.link} onClick={() => navigate('/admin-dashboard')}>Dashboard</span>
            <span style={styles.link} onClick={() => navigate('/add-equipment')}>Add Equipment</span>
            <span style={styles.link} onClick={() => navigate('/manage-requests')}>Manage Rentals</span>
            <span style={styles.link} onClick={() => navigate('/billing-report')}>Billing Report</span>
            <span style={styles.link} onClick={() => navigate('/profile')}>Profile</span> 
          </>
        )}

        {user && (
          <span style={styles.link} onClick={handleLogout}>Logout</span>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: '15px 30px',
    color: '#fff',
  },
  logo: {
    fontSize: '18px',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    cursor: 'pointer',
    color: '#f9c440',
    fontWeight: 'bold',
  },
};

export default Navbar;
