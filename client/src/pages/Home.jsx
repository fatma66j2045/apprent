// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import EquipmentCard from '../components/EquipmentCard';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../Store/cartSlice';
import useLocation from "../utils/useLocation";
const Home = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [rentalDuration, setRentalDuration] = useState('');
  const { placeInfo, error: locationError } = useLocation();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`${API_URL}/api/equipment`);
        const data = await res.json();
        setEquipmentList(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
  }, [API_URL]);

  const handleRentNow = (item) => {
    if (!user || user.role !== 'customer') {
      Swal.fire({
        icon: 'info',
        title: 'Login required',
        text: 'Please login as a customer to rent equipment.',
        confirmButtonColor: '#f9c440',
      });
      return;
    }

    setSelectedEquipment(item);
    setRentalDuration('');
  };

  const handleAddToCart = () => {
    if (!rentalDuration) {
      Swal.fire({
        icon: 'warning',
        title: 'Please select rental duration',
        confirmButtonColor: '#f9c440',
      });
      return;
    }

    const cartItem = {
      name: selectedEquipment.name,
      price: selectedEquipment.price,
      image: selectedEquipment.image,
      rentalDuration,
      equipmentId: selectedEquipment._id,
      ownerId: selectedEquipment.ownerId,
    };

    dispatch(addToCart(cartItem)); // ✅ Use Redux instead of localStorage

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${selectedEquipment.name} has been added.`,
      confirmButtonColor: '#f9c440',
    });

    setSelectedEquipment(null); // Close modal
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Browse Equipment</h2>
        {placeInfo && (
  <div style={styles.locationBox}>
    <p style={styles.locationText}>
      📍 You’re browsing from: <strong>{placeInfo.city}, {placeInfo.region}, {placeInfo.country}</strong>
    </p>
  </div>
)}

        <div style={styles.cardGrid}>
          {equipmentList.map((item, index) => (
            <EquipmentCard
              key={index}
              name={item.name}
              price={item.price}
              image={item.image}
              onRentNowClick={() => handleRentNow(item)}
            />
          ))}
        </div>
      </div>

      {selectedEquipment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{selectedEquipment.name}</h3>
            <img
              src={`${API_URL}/assets/images/${selectedEquipment.image}`}
              alt={selectedEquipment.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <p><strong>Price:</strong> {selectedEquipment.price} OMR/day</p>
            <p><strong>Description:</strong> {selectedEquipment.description}</p>

            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Select Rental Duration:</label>
              <select
                style={styles.select}
                value={rentalDuration}
                onChange={(e) => setRentalDuration(e.target.value)}
              >
                <option value="">Select Rental Duration</option>
                <option value="1 Day">1 Day</option>
                <option value="3 Days">3 Days</option>
                <option value="1 Week">1 Week</option>
              </select>
            </div>

            <button style={styles.button} onClick={handleAddToCart}>Add to Cart</button>
            <button
              style={{ ...styles.button, marginTop: '10px', backgroundColor: 'red', color: 'white' }}
              onClick={() => setSelectedEquipment(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9c440',
    minHeight: '100vh',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  cardGrid: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '400px',
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '15px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f9c440',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  locationBox: {
  backgroundColor: "#fff3cd",
  padding: "12px 20px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ffeeba",
  textAlign: "center",
},
locationText: {
  margin: 0,
  fontSize: "16px",
  color: "#856404",
},

};

export default Home;
