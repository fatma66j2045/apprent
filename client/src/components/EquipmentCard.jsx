
import React from 'react';

const EquipmentCard = ({ image, name, price, onRentNowClick }) => {
  const API_URL = process.env.REACT_APP_SERVER_URL;

  return (
    <div style={styles.card}>
      <img
        src={`${API_URL}/assets/images/${image}`}
        alt={name}
        style={styles.image}
      />

      <div style={styles.info}>
        <h3>{name}</h3>
        <p>{price} OMR/day</p>
        <button style={styles.button} onClick={onRentNowClick}>
          Rent Now
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: '250px',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '15px',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px 10px 0 0',
  },
  info: {
    padding: '15px',
    textAlign: 'center',
  },
  button: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#f9c440',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default EquipmentCard;
