// src/pages/ManageRequests.js

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const user = useSelector((state) => state.users.user);
  const API_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rentals/owner/${user._id}`);
      const data = await res.json();
      setRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error('Error fetching rental requests:', error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You want to ${newStatus} this request!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${newStatus}!`,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/rentals/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire('Success!', 'Rental request updated successfully.', 'success');
          fetchRequests();
        } else {
          Swal.fire('Error!', data.message || 'Error updating rental request.', 'error');
        }
      } catch (error) {
        console.error('Error updating rental request:', error);
        Swal.fire('Error!', 'Error updating rental request.', 'error');
      }
    }
  };

  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);

    if (status === 'all') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(req => req.status.toLowerCase() === status));
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Manage Rental Requests</h2>

        {/* Filter Dropdown */}
        <div style={styles.filterBox}>
          <label>Filter By:</label>
          <select style={styles.select} value={filterStatus} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="approved">Already Rented (Approved)</option>
            <option value="pending">Want to Rent (Pending)</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredRequests.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No rental requests yet.</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.centerCell}>Equipment</th>
                <th style={styles.centerCell}>Customer</th>
                <th style={styles.centerCell}>Duration</th>
                <th style={styles.centerCell}>Total Cost</th>
                <th style={styles.centerCell}>Status</th>
                <th style={styles.centerCell}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req, index) => (
                <tr
                  key={index}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={styles.centerCell}>{req.equipmentName}</td>
                  <td style={styles.centerCell}>{req.customerName}</td>
                  <td style={styles.centerCell}>{req.rentalDuration}</td>
                  <td style={styles.centerCell}>{req.totalCost} OMR</td>
                  <td style={styles.centerCell}>
                    <strong>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</strong>
                  </td>
                  <td style={styles.centerCell}>
                    {req.status.toLowerCase() === 'pending' ? (
                      <>
                        <button
                          style={{ ...styles.smallBtn, backgroundColor: 'green' }}
                          onClick={() => handleUpdateStatus(req._id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button
                          style={{ ...styles.smallBtn, backgroundColor: 'red', marginLeft: '5px' }}
                          onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </>
                    ) : req.status.toLowerCase() === 'approved' ? (
                      <span style={{ fontSize: '24px', color: 'green' }}>✔️</span>
                    ) : (
                      <span style={{ fontSize: '24px', color: 'red' }}>❌</span>
                    )}
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
  container: {
    padding: '30px',
    backgroundColor: '#f9c440',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  filterBox: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginLeft: '10px',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  thead: {
    backgroundColor: '#f5af05',
    fontSize: '16px',
  },
  centerCell: {
    textAlign: 'center',
    padding: '15px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #eee',
  },
  smallBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default ManageRequests;
