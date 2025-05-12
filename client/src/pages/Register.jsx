import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const API_URL = process.env.REACT_APP_SERVER_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('❌ Passwords did not match!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessageType('success');
        setMessage('✅ ' + data.message);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('customer');

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessageType('error');
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage('❌ Error registering user');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Create an Account</h2>

        {message && (
          <div style={{
            ...styles.messageBox,
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            borderColor: messageType === 'success' ? '#c3e6cb' : '#f5c6cb',
          }}>
            {message}
          </div>
        )}

        <label htmlFor="name" style={styles.label}>Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="email" style={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="password" style={styles.label}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="role" style={styles.label}>I am a:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
        </select>

        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={styles.button}>Register</button>
        </div>

        <p style={styles.login} onClick={() => navigate('/')}>
          Already have an account? Login
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
  login: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
  },
};

export default Register;
