// src/pages/AddEquipment.js

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const AddEquipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(null);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    price: '',
    description: '',
    imageFile: null,
  });

  const user = useSelector((state) => state.users.user);
  const API_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchEquipments();
    }
  }, [user]);

  const fetchEquipments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/equipment/owner/${user._id}`);
      const data = await res.json();
      setEquipments(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleEdit = (item) => {
    setCurrentEquipment(item);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this equipment!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f9c440',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/api/equipment/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', 'Equipment has been deleted.', 'success');
          fetchEquipments();
        } else {
          Swal.fire('Error!', data.message || 'Error deleting equipment', 'error');
        }
      } catch (error) {
        console.error('Error deleting equipment:', error);
        Swal.fire('Error!', 'Error deleting equipment', 'error');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/equipment/${currentEquipment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentEquipment.name,
          price: currentEquipment.price,
          description: currentEquipment.description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire('Success!', 'Equipment updated successfully.', 'success');
        setEditModalOpen(false);
        fetchEquipments();
      } else {
        Swal.fire('Error!', data.message || 'Error updating equipment', 'error');
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      Swal.fire('Error!', 'Error updating equipment', 'error');
    }
  };

  const handleFileChange = (e) => {
    setNewEquipment({ ...newEquipment, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEquipment.imageFile) {
      Swal.fire('Warning!', 'Please upload an image.', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newEquipment.name);
      formData.append('price', newEquipment.price);
      formData.append('description', newEquipment.description);
      formData.append('ownerId', user._id);
      formData.append('image', newEquipment.imageFile);

      const res = await fetch(`${API_URL}/api/equipment`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire('Success!', 'Equipment added successfully.', 'success');
        setShowModal(false);
        setNewEquipment({ name: '', price: '', description: '', imageFile: null });
        fetchEquipments();
      } else {
        Swal.fire('Error!', data.message || 'Error adding equipment', 'error');
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
      Swal.fire('Error!', 'Error adding equipment', 'error');
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.title}>Manage Equipment</h2>

        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          + Add Equipment
        </button>

        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.centerCell}>Image</th>
              <th style={styles.centerCell}>Name</th>
              <th style={styles.centerCell}>Price (OMR/day)</th>
              <th style={styles.centerCell}>Description</th>
              <th style={styles.centerCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((item, index) => (
              <tr
                key={index}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <td style={styles.centerCell}>
                  <img
                    src={`${API_URL}/assets/images/${item.image}`}
                    alt={item.name}
                    style={styles.image}
                  />
                </td>
                <td style={styles.centerCell}>{item.name}</td>
                <td style={styles.centerCell}>{item.price}</td>
                <td style={styles.centerCell}>{item.description}</td>
                <td style={styles.centerCell}>
                  <button style={styles.smallBtn} onClick={() => handleEdit(item)}>Edit</button>
                  <button
                    style={{ ...styles.smallBtn, backgroundColor: 'red', marginLeft: '5px' }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add New Equipment</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={newEquipment.name} onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })} style={styles.input} required />
              <input type="number" placeholder="Price" value={newEquipment.price} onChange={(e) => setNewEquipment({ ...newEquipment, price: e.target.value })} style={styles.input} required />
              <textarea placeholder="Description" value={newEquipment.description} onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })} style={styles.input} required />
              <input type="file" onChange={handleFileChange} style={styles.input} accept="image/*" required />
              <button type="submit" style={styles.button}>Add Equipment</button>
              <button type="button" style={{ ...styles.button, backgroundColor: 'red', marginTop: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentEquipment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Equipment</h3>
            <form onSubmit={handleUpdate}>
              <input type="text" placeholder="Name" value={currentEquipment.name} onChange={(e) => setCurrentEquipment({ ...currentEquipment, name: e.target.value })} style={styles.input} required />
              <input type="number" placeholder="Price" value={currentEquipment.price} onChange={(e) => setCurrentEquipment({ ...currentEquipment, price: e.target.value })} style={styles.input} required />
              <textarea placeholder="Description" value={currentEquipment.description} onChange={(e) => setCurrentEquipment({ ...currentEquipment, description: e.target.value })} style={styles.input} required />
              <button type="submit" style={styles.button}>Update Equipment</button>
              <button type="button" style={{ ...styles.button, backgroundColor: 'red', marginTop: '10px' }} onClick={() => setEditModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: { padding: '30px', backgroundColor: '#f9c440', minHeight: '100vh' },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' },
  addBtn: { padding: '10px 20px', marginBottom: '20px', backgroundColor: '#000', color: '#fff', borderRadius: '5px', cursor: 'pointer' },
  table: { width: '100%', backgroundColor: '#fff', borderCollapse: 'separate', borderSpacing: '0', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  thead: { backgroundColor: '#f9c440', fontSize: '16px' },
  centerCell: { textAlign: 'center', padding: '15px', verticalAlign: 'middle', borderBottom: '1px solid #eee' },
  smallBtn: { padding: '8px 16px', backgroundColor: '#f9c440', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  image: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { width: '400px', backgroundColor: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#f9c440', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
};

export default AddEquipment;
