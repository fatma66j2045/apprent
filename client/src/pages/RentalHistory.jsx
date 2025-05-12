import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const user = useSelector((state) => state.users.user);
  const API_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (!user) return;

    const fetchRentals = async () => {
      try {
        const res = await fetch(`${API_URL}/api/rentals/customer/${user._id}`);
        const data = await res.json();
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      }
    };

    fetchRentals();
  }, [user, API_URL]);

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <h2 style={styles.heading}>My Rental History</h2>

        {rentals.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No rentals found</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.centerCell}>Item</th>
                <th style={styles.centerCell}>Rental Duration</th>
                <th style={styles.centerCell}>Date</th>
                <th style={styles.centerCell}>Total</th>
                <th style={styles.centerCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental, index) => (
                <tr
                  key={index}
                  style={{ transition: '0.3s', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={styles.centerCell}>
                    <div style={styles.itemCell}>
                      <img
                        src={`${API_URL}/assets/images/${rental.image}`}
                        alt={rental.equipmentName}
                        style={styles.image}
                      />
                      <span>{rental.equipmentName}</span>
                    </div>
                  </td>
                  <td style={styles.centerCell}>{rental.rentalDuration}</td>
                  <td style={styles.centerCell}>{new Date(rental.rentalDate).toLocaleDateString()}</td>
                  <td style={styles.centerCell}><strong>{rental.totalCost} OMR</strong></td>
                  <td style={styles.centerCell}>
                    <strong>{formatStatus(rental.status)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  wrapper: {
    padding: '40px',
    backgroundColor: '#f9c440',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  table: {
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  thead: {
    backgroundColor: '#f9c440',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  centerCell: {
    textAlign: 'center',
    padding: '15px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #eee',
  },
  itemCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'center',
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid #ccc',
  },
};

export default RentalHistory;
