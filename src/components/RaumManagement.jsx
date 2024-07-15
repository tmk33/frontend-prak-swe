import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/RaumManagement.module.css'; 

function RaumManagement() {
  const [raeume, setRaeume] = useState([]);
  const [filteredRaeume, setFilteredRaeume] = useState([]);
  const [raumNameFilter, setRaumNameFilter] = useState(''); 
  const [showAddRaumForm, setShowAddRaumForm] = useState(false);
  const [newRaum, setNewRaum] = useState({
    name: '',
    ort: '',
  });

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/admin-dashboard');
  };

  useEffect(() => {
    const fetchRaeume = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/raum');
        setRaeume(res.data);
        setFilteredRaeume(res.data); 
      } catch (error) {
        console.error("Error fetching raeume:", error);
      }
    };

    fetchRaeume();
  }, []);

  useEffect(() => {
    const filtered = raeume.filter(raum => raum.name.toLowerCase().includes(raumNameFilter.toLowerCase()));
    setFilteredRaeume(filtered);
  }, [raumNameFilter, raeume]);

  const handleRaumNameFilterChange = (event) => {
    setRaumNameFilter(event.target.value);
  };

  const handleAddRaumClick = () => {
    setShowAddRaumForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRaum(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://prak-swe.onrender.com/raum', newRaum, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setRaeume([...raeume, res.data]);
      setFilteredRaeume([...filteredRaeume, res.data]);
      setShowAddRaumForm(false);
      alert('Raum added successfully!');
    } catch (error) {
      console.error('Error adding raum:', error);
      alert('Failed to add raum.');
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>  
        <button onClick={handleBackClick} className={styles.backButton}>Back</button> 
      </div>
      <h1>Raum verwalten</h1>

      <input
        type="text"
        placeholder="Filter by Raum Name"
        value={raumNameFilter}
        onChange={handleRaumNameFilterChange}
        className={styles.input}
      />
      <div className={styles.buttonContainer}>
        <button onClick={handleAddRaumClick} className={styles.addButton}>
          Add Raum
        </button>
      </div>

      {showAddRaumForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newRaum.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="ort"
            placeholder="Ort"
            value={newRaum.ort}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Ort</th>
          </tr>
        </thead>
        <tbody>
          {filteredRaeume.map(raum => (
            <tr key={raum.id}>
              <td>{raum.id}</td>
              <td>{raum.name}</td>
              <td>{raum.ort}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RaumManagement;
