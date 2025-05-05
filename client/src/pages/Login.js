// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../Store/usersSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const API_URL = process.env.REACT_APP_SERVER_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageType('success');
        setMessage('✅ ' + data.message);

        // ✅ Save to Redux
        dispatch(loginSuccess(data.user));

        // ✅ Save to localStorage (for persistence)
        localStorage.setItem('user', JSON.stringify(data.user));

        setTimeout(() => {
          if (data.user.role === 'customer') {
            navigate('/home');
          } else if (data.user.role === 'owner') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        setMessageType('error');
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessageType('error');
      setMessage('❌ Error logging in. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Tools and Heavy Equipment Rental Platform</h2>

        {message && (
          <div
            style={{
              ...styles.messageBox,
              backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
              color: messageType === 'success' ? '#155724' : '#721c24',
              borderColor: messageType === 'success' ? '#c3e6cb' : '#f5c6cb',
            }}
          >
            {message}
          </div>
        )}

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={styles.button}>Login</button>
        </div>

        <p style={styles.register} onClick={() => navigate('/register')}>
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9c440',
  },
  form: {
    width: '350px',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '25px',
    fontWeight: '600',
  },
  messageBox: {
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '14px',
    textAlign: 'center',
  },
  label: {
    textAlign: 'left',
    display: 'block',
    marginTop: '15px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '14px',
  },
  button: {
    marginTop: '25px',
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#f9c440',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  register: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
  },
};

export default Login;
