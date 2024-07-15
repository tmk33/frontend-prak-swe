import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/KursManagement.module.css'; // Adjust the path if needed

function KursManagement() {
  const [kurse, setKurse] = useState([]);
  const [filteredKurse, setFilteredKurse] = useState([]);
  const [filterType, setFilterType] = useState('none'); 
  const [filterValue, setFilterValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKurs, setNewKurs] = useState({
    name: '',
    fachbereichId: '',
  });

  useEffect(() => {
    const fetchKurse = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/kurs');
        setKurse(res.data);
        setFilteredKurse(res.data);
      } catch (error) {
        console.error("Error fetching kurse:", error);
        alert("Failed to fetch kurse.");
      }
    };

    fetchKurse();
  }, []);

  useEffect(() => {
    // ... (filtering logic remains the same)
  }, [filterType, filterValue, kurse]);

  const handleFilterChange = (event) => {
    // ... (filter change handling remains the same)
  };

  const handleFilterValueChange = (event) => {
    // ... (filter value change handling remains the same)
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewKurs(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://prak-swe.onrender.com/kurs/add', newKurs, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setKurse([...kurse, res.data]); // Add new Kurs to the list
      setFilteredKurse([...filteredKurse, res.data]); // Add to filtered list too
      setShowAddForm(false);
      setNewKurs({ name: '', fachbereichId: '' }); // Reset form
      alert('Kurs added successfully!');
    } catch (error) {
      console.error('Error adding kurs:', error);
      alert('Failed to add kurs.');
    }
  };

  const handleDeleteClick = async (kursId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this kurs?')) {
      try {
        await axios.delete(`https://prak-swe.onrender.com/kurs/${kursId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setKurse(kurse.filter(k => k.id !== kursId)); // Remove deleted Kurs
        setFilteredKurse(filteredKurse.filter(k => k.id !== kursId)); // Remove from filtered list
        alert('Kurs deleted successfully!');
      } catch (error) {
        console.error('Error deleting kurs:', error);
        alert('Failed to delete kurs.');
      }
    }
  };

  return (
    <div className={styles.container}>
    <h2>Kurs verwalten</h2>

    {/* Filter Options */}
    <select value={filterType} onChange={handleFilterChange}>
      <option value="none">No Filter</option>
      <option value="fachbereich">By Fachbereich ID</option>
      <option value="dozentId">By Dozent ID</option>
      <option value="dozentName">By Dozent Name</option>
    </select>
    {filterType !== 'none' && (
      <input 
        type="text" 
        placeholder={`Enter ${filterType === 'fachbereich' ? 'Fachbereich ID' : 'Dozent ID or Name'}`}
        value={filterValue}
        onChange={handleFilterValueChange} 
      />
    )}

    {/* Add Button */}
    <div className={styles.buttonContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>
        Add Kurs
      </button>
    </div>

    {/* Add Form */}
    {showAddForm && (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          name="name" 
          placeholder="Kurs Name"
          value={newKurs.name} 
          onChange={handleInputChange}
          required 
        />
        <input 
          type="number" 
          name="fachbereichId" 
          placeholder="Fachbereich ID"
          value={newKurs.fachbereichId} 
          onChange={handleInputChange}
          required 
        />
        <button type="submit">Add</button>
      </form>
    )}

    {/* Table */}
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Fachbereich ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredKurse.map(kurs => (
          <tr key={kurs.id}>
            <td>{kurs.id}</td>
            <td>{kurs.name}</td>
            <td>{kurs.fachbereichId}</td>
            <td>
              <button onClick={() => handleDeleteClick(kurs.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

export default KursManagement;
