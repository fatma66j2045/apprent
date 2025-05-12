import React, { useState } from 'react';
import Swal from 'sweetalert2';

const EquipmentModal = ({ item, onClose }) => {
  const [rentalDuration, setRentalDuration] = useState('');
  const API_URL = process.env.REACT_APP_SERVER_URL;

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
      name: item.name,
      price: item.price,
      image: item.image,
      rentalDuration,
      equipmentId: item._id,
      ownerId: item.ownerId,
    };

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${item.name} has been added.`,
      confirmButtonColor: '#f9c440',
    });

    onClose(); // Close modal after adding
  };

  if (!item) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{item.name}</h3>
        <img
          src={`${API_URL}/assets/images/${item.image}`}
          alt={item.name}
          style={styles.image}
        />
        <p style={styles.price}><strong>OMR {item.price}</strong>/day</p>

        <div>
          <h4>Description</h4>
          <p>{item.description || "No description available."}</p>
        </div>

        <hr style={styles.divider} />

        <div>
          <label style={styles.label}>Select Rental Duration</label>
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

        <button style={styles.button} onClick={handleAddToCart}>
          Add to Cart
        </button>

        <button style={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '400px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '25px',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    margin: '15px 0',
    borderRadius: '10px',
  },
  price: {
    textAlign: 'right',
    fontSize: '18px',
  },
  divider: {
    margin: '20px 0',
  },
  label: {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#f9c440',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  closeButton: {
    marginTop: '15px',
    backgroundColor: '#ccc',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};

export default EquipmentModal;
