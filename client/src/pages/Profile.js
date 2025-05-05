// src/pages/Profile.js

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [name, setName] = useState(user?.name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const API_URL = process.env.REACT_APP_SERVER_URL;

  const handleUpdateName = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update localStorage + success alert
        const updatedUser = { ...user, name };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        Swal.fire('Success!', data.message, 'success');
      } else {
        Swal.fire('Error', data.message || 'Could not update name', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return Swal.fire('Warning', 'New passwords do not match', 'warning');
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        Swal.fire('Success!', data.message, 'success');
      } else {
        Swal.fire('Error', data.message || 'Password change failed', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>My Profile</h2>

        {/* Update Name */}
        <div style={styles.box}>
          <h3>Update Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={handleUpdateName}>Update Name</button>
        </div>

        {/* Change Password */}
        <div style={styles.box}>
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <button style={styles.button} onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f9c440',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1f1f1f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Profile;
