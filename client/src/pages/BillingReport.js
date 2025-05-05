import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { jsPDF } from 'jspdf';
import { Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import 'chart.js/auto';
import { useSelector } from 'react-redux';

const BillingReport = () => {
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showChart, setShowChart] = useState(false);

  const user = useSelector((state) => state.users.user);
  const API_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchBillingData();
    }
  }, [user]);

  const fetchBillingData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rentals/owner/${user._id}`);
      const data = await res.json();

      const approvedRentals = data.filter(rental => rental.status.toLowerCase() === 'approved');
      setRentals(approvedRentals);
      setFilteredRentals(approvedRentals);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      Swal.fire('Error', 'Could not fetch billing data.', 'error');
    }
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      Swal.fire('Missing dates', 'Please select both From and To dates!', 'warning');
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    const filtered = rentals.filter(rental => {
      const rentalDate = new Date(rental.rentalDate);
      return rentalDate >= from && rentalDate <= to;
    });

    setFilteredRentals(filtered);
  };

  const calculateTotalEarnings = () => {
    return filteredRentals.reduce((total, rental) => total + rental.totalCost, 0);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Billing Report', 10, 10);
    filteredRentals.forEach((rental, index) => {
      doc.text(
        `${index + 1}. ${rental.equipmentName} | ${rental.totalCost} OMR | ${new Date(rental.rentalDate).toLocaleDateString()}`,
        10,
        20 + index * 10
      );
    });
    doc.text(`Total Earnings: ${calculateTotalEarnings()} OMR`, 10, 30 + filteredRentals.length * 10);
    doc.save('billing_report.pdf');

    Swal.fire('Downloaded!', 'Billing Report PDF has been saved.', 'success');
  };

  const chartData = {
    labels: filteredRentals.map(rental => rental.equipmentName),
    datasets: [
      {
        label: 'Earnings (OMR)',
        data: filteredRentals.map(rental => rental.totalCost),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <h2 style={styles.heading}>Billing Report</h2>

        {/* Filter Section */}
        <div style={styles.filterBox}>
          <div style={styles.filterRow}>
            <div>
              <label>From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={styles.dateInput}
              />
            </div>

            <div>
              <label>To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={styles.dateInput}
              />
            </div>

            <button style={styles.button} onClick={handleFilter}>Filter</button>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.button} onClick={handleDownloadPDF}>Download PDF</button>
          <button
            style={{ ...styles.button, backgroundColor: '#007bff' }}
            onClick={() => setShowChart(true)}
          >
            Show Chart
          </button>
        </div>

        {/* Earnings */}
        <div style={styles.totalBox}>
          <h3>Total Earnings: {calculateTotalEarnings()} OMR</h3>
        </div>

        {/* Rentals Table */}
        {filteredRentals.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No approved rentals in selected range</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.centerCell}>Equipment</th>
                <th style={styles.centerCell}>Customer</th>
                <th style={styles.centerCell}>Total Cost</th>
                <th style={styles.centerCell}>Rental Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental, index) => (
                <tr
                  key={index}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={styles.centerCell}>{rental.equipmentName}</td>
                  <td style={styles.centerCell}>{rental.customerName}</td>
                  <td style={styles.centerCell}>{rental.totalCost} OMR</td>
                  <td style={styles.centerCell}>{new Date(rental.rentalDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chart Modal */}
      {showChart && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: '20px' }}>Earnings Chart</h3>
            <Bar data={chartData} />
            <button
              style={{ ...styles.button, marginTop: '20px', backgroundColor: 'red' }}
              onClick={() => setShowChart(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  wrapper: { padding: '40px', backgroundColor: '#f9c440', minHeight: '100vh' },
  heading: { textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' },
  filterBox: { marginBottom: '30px', textAlign: 'center' },
  filterRow: { display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' },
  dateInput: { padding: '8px', borderRadius: '6px', border: '1px solid #ccc' },
  button: { padding: '10px 20px', backgroundColor: '#000', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  actions: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' },
  totalBox: { textAlign: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' },
  table: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderCollapse: 'separate',
    borderSpacing: '0',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  thead: { backgroundColor: '#f5af05', fontSize: '16px' },
  centerCell: {
    textAlign: 'center',
    padding: '15px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #eee',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '600px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
  },
};

export default BillingReport;
