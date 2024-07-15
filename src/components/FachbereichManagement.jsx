import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/FachbereichManagement.module.css'; 
import { useNavigate } from 'react-router-dom';


function FachbereichManagement() {
  const [fachbereiche, setFachbereiche] = useState([]);
  const [filteredFachbereiche, setFilteredFachbereiche] = useState([]);
  const [fachbereichNameFilter, setFachbereichNameFilter] = useState('');
  const [showAddFachbereichForm, setShowAddFachbereichForm] = useState(false);
  const [newFachbereich, setNewFachbereich] = useState({
    name: '',
  });

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/admin-dashboard');
  };

  useEffect(() => {
    const fetchFachbereiche = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/fachbereich');
        setFachbereiche(res.data);
        setFilteredFachbereiche(res.data);
      } catch (error) {
        console.error("Error fetching fachbereiche:", error);
        alert("Failed to fetch fachbereiche."); 
      }
    };

    fetchFachbereiche();
  }, []);

  useEffect(() => {
    const filtered = fachbereiche.filter(fb => 
      fb.name.toLowerCase().includes(fachbereichNameFilter.toLowerCase())
    );
    setFilteredFachbereiche(filtered);
  }, [fachbereichNameFilter, fachbereiche]);

  const handleFachbereichNameFilterChange = (event) => {
    setFachbereichNameFilter(event.target.value);
  };

  const handleAddFachbereichClick = () => {
    setShowAddFachbereichForm(true);
  };

  const handleInputChange = (event) => {
    setNewFachbereich({ name: event.target.value }); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://prak-swe.onrender.com/fachbereich', newFachbereich, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setFachbereiche([...fachbereiche, res.data]);
      setFilteredFachbereiche([...filteredFachbereiche, res.data]);
      setShowAddFachbereichForm(false);
      alert('Fachbereich added successfully!');
    } catch (error) {
      console.error('Error adding fachbereich:', error);
      alert("Failed to add fachbereich."); 
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.buttonContainer}>  
        <button onClick={handleBackClick} className={styles.backButton}>Back</button> 
      </div>
      <h1>Fachbereich verwalten</h1>

      <input 
        type="text" 
        placeholder="Filter by Fachbereich Name"
        value={fachbereichNameFilter}
        onChange={handleFachbereichNameFilterChange}
        className={styles.input} 
      />

      <div className={styles.buttonContainer}>
        <button onClick={handleAddFachbereichClick} className={styles.addButton}>
          Add Fachbereich
        </button>
      </div>

      {showAddFachbereichForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            type="text" 
            name="name" 
            placeholder="Name+Semester (Informatik2,...)"
            value={newFachbereich.name} 
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
          </tr>
        </thead>
        <tbody>
          {filteredFachbereiche.map(fb => (
            <tr key={fb.id}>
              <td>{fb.id}</td>
              <td>{fb.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FachbereichManagement;
