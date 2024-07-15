import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/KursManagement.module.css';
import { useNavigate } from 'react-router-dom';


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
  const [fachbereiche, setFachbereiche] = useState([]);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/admin-dashboard');
  };

  const fetchFachbereiche = async() => {
        const token = localStorage.getItem('token');
        try{
            const res = await axios.get('https://prak-swe.onrender.com/fachbereich',{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFachbereiche(res.data);
        } catch(error){
            console.log(error);
        }
    };

    useEffect(() => {
    fetchFachbereiche(); 
    }, []);

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

  useEffect(() => {
    fetchKurse(); 
  }, []);

  useEffect(() => {
    const fetchFilteredKurse = async () => {
      let endpoint = 'https://prak-swe.onrender.com/kurs';
      if (filterType === 'fachbereich') {
        endpoint += `/fachbereich/${filterValue}`;
      } else if (filterType === 'dozentId' && filterValue !== '') { 
        endpoint += `/dozent/id/${filterValue}`;
      } else if (filterType === 'dozentName' && filterValue !== '') { 
        endpoint += `/dozent/name/${encodeURIComponent(filterValue)}`;
      } 

      try {
        const res = await axios.get(endpoint);
        setFilteredKurse(res.data);
      } catch (error) {
        console.error("Error fetching filtered kurse:", error);
        alert("Failed to fetch filtered kurse.");
      }
    };

    if (filterValue) { 
      fetchFilteredKurse();
    } else {
      setFilteredKurse(kurse); 
    }
  }, [filterType, filterValue, kurse]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setFilterValue(''); 
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);

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
      setKurse([...kurse, res.data]);
      setFilteredKurse([...filteredKurse, res.data]);
      setShowAddForm(false);
      setNewKurs({ name: '', fachbereichId: '' });
      fetchKurse();
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
        setKurse(kurse.filter(k => k.id !== kursId));
        setFilteredKurse(filteredKurse.filter(k => k.id !== kursId));
        fetchKurse();
        alert('Kurs deleted successfully!');
      } catch (error) {
        console.error('Error deleting kurs:', error);
        alert('Failed to delete kurs.');
      }
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.buttonContainer}>  
        <button onClick={handleBackClick} className={styles.backButton}>Back</button> 
      </div>
      <h1>Kurs verwalten</h1>

      <div className={styles.filterSection}>
        <select value={filterType} onChange={handleFilterChange}>
          <option value="none">No Filter</option>
          <option value="fachbereich">By Fachbereich</option> 
          <option value="dozentId">By Dozent ID</option>
          <option value="dozentName">By Dozent Name</option>
        </select>

        {filterType === 'fachbereich' ? ( 
          <select value={filterValue} onChange={handleFilterValueChange}>
            <option value="">Select Fachbereich</option>
            {fachbereiche.map(fb => (
              <option key={fb.id} value={fb.id}>{fb.name}</option>
            ))}
          </select>
        ) : ( 
          <input
            type={filterType === 'dozentName' ? 'text' : 'number'}
            placeholder={filterType === 'dozentId' ? 'Dozent ID' : 'Dozent Name'}
            value={filterValue}
            onChange={handleFilterValueChange}
          />
        )}
      </div>

      
    <div className={styles.buttonContainer}>
      <button onClick={handleAddClick} className={styles.addButton}>
        Add Kurs
      </button>
    </div>

    
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
        <select className={styles.filterSelect}
            name="fachbereichId" 
            value={newKurs.fachbereichId} 
            onChange={handleInputChange} 
            required
        >
            <option value="">Select Fachbereich</option>
            {fachbereiche.map(fb => (
              <option key={fb.id} value={fb.id}>{fb.name}</option> 
            ))}
        </select>
        <button type="submit">Add</button>
      </form>
    )}

    {/* Table */}
    <table className={styles.table}>
      <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Wochentag</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Dozent</th>
            <th>Raum</th>
            <th>Fachbereich</th>
            <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredKurse.map(kurs => (
          <tr key={kurs.kurs_id}>
             <td>{kurs.kurs_id}</td>
              <td>{kurs.kurs_name}</td>
              <td>{kurs.wochentag}</td>
              <td>{kurs.starttime}</td>
              <td>{kurs.endtime}</td>
              <td>{kurs.dozent}</td>
              <td>{kurs.raum}</td>
              <td>{kurs.fachbereich}</td>
            <td>
              <button className={styles.deleteButton} onClick={() => handleDeleteClick(kurs.kurs_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default KursManagement;
