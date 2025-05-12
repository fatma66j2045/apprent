// src/pages/Cart.js

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../Store/cartSlice';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const [selectedItem, setSelectedItem] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleCheckout = (item) => {
    setSelectedItem(item);
    setShowSummary(true);
  };

  const handleProceed = () => {
    setShowSummary(false);
    setShowPayment(true);
  };

  const handleDeleteItem = (itemId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are removing this item from your cart!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f9c440',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFromCart(itemId));
        Swal.fire('Deleted!', 'Item has been removed.', 'success');
      }
    });
  };

  const handleConfirmRental = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedItem.equipmentId,
          equipmentName: selectedItem.name,
          image: selectedItem.image,
          ownerId: selectedItem.ownerId,
          customerId: user._id,
          rentalDuration: selectedItem.rentalDuration,
          totalCost: calculateTotal(selectedItem),
        }),
      });

      if (res.ok) {
        dispatch(removeFromCart(selectedItem.equipmentId));
        setShowPayment(false);
        setShowThankYou(true);
      } else {
        throw new Error("Rental failed");
      }
    } catch (error) {
      console.error('Error saving rental:', error);
      Swal.fire('Error', 'Failed to confirm rental. Please try again.', 'error');
    }
  };

  const getDaysFromDuration = (duration) => {
    if (duration === '1 Day') return 1;
    if (duration === '3 Days') return 3;
    if (duration === '1 Week') return 7;
    return 1;
  };

  const calculateTotal = (item) => {
    return item.price * getDaysFromDuration(item.rentalDuration);
  };

  return (
    <>
      <Navbar />
      <div style={styles.wrapper}>
        <h2 style={styles.heading}>Your Rental Cart</h2>

        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Cart is empty</p>
        ) : (
          <table style={styles.table}>
            <thead style={{ backgroundColor: '#f9c440', color: '#333', fontWeight: 'bold' }}>
              <tr>
                <th style={styles.centerCell}>ITEM</th>
                <th style={styles.centerCell}>RENTAL DURATION</th>
                <th style={styles.centerCell}>TOTAL</th>
                <th style={styles.centerCell}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td style={styles.centerCell}>
                    <div style={styles.itemCell}>
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}/assets/images/${item.image}`}
                        alt={item.name}
                        style={styles.image}
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td style={styles.centerCell}>{item.rentalDuration}</td>
                  <td style={styles.centerCell}>
                    <strong>{calculateTotal(item)} OMR</strong>
                  </td>
                  <td style={styles.centerCell}>
                    <button
                      style={styles.smallBtn}
                      onClick={() => handleCheckout(item)}
                    >
                      Checkout
                    </button>
                    <button
                      style={{ ...styles.smallBtn, backgroundColor: 'red', marginLeft: '5px' }}
                      onClick={() => handleDeleteItem(item.equipmentId)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* === Summary Modal === */}
      {showSummary && selectedItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Shopping Cart Summary</h3>
            <p>{selectedItem.name}</p>
            <p>Rental Duration: {selectedItem.rentalDuration}</p>
            <p>Total: {calculateTotal(selectedItem)} OMR</p>
            <button style={styles.button} onClick={handleProceed}>Proceed to Checkout</button>
          </div>
        </div>
      )}

      {/* === Payment Modal === */}
      {showPayment && selectedItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Confirm Rental & Payment</h3>
            <p>{selectedItem.name} - {selectedItem.rentalDuration}</p>
            <p><strong>Payment:</strong> Cash on Delivery</p>
            <button style={styles.button} onClick={handleConfirmRental}>Confirm Rental</button>
          </div>
        </div>
      )}

      {/* === Thank You Modal === */}
      {showThankYou && selectedItem && (
        <div style={{ ...styles.modalOverlay, backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div style={{ ...styles.modal, backgroundColor: '#f9c440', textAlign: 'center' }}>
            <h2>🎉 Thank You for Your Rental!</h2>
            <p>{selectedItem.name} - {selectedItem.rentalDuration}</p>
            <p>Total: {calculateTotal(selectedItem)} OMR</p>
            <button
              style={{ ...styles.button, backgroundColor: '#000', color: '#fff', marginTop: '20px' }}
              onClick={() => window.location.href = '/home'}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
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
    borderCollapse: 'collapse',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  centerCell: {
    textAlign: 'center',
    padding: '15px',
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
  },
  smallBtn: {
    padding: '8px 16px',
    backgroundColor: '#f9c440',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  button: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#f9c440',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
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
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
};

export default Cart;
