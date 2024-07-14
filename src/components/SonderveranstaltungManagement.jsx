import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/SonderveranstaltungManagement.module.css';

function SonderveranstaltungManagement() {
  const [sonderveranstaltungen, setSonderveranstaltungen] = useState([]);
  const [filteredSonderveranstaltungen, setFilteredSonderveranstaltungen] = useState([]);
  const [filter, setFilter] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSonderveranstaltung, setNewSonderveranstaltung] = useState({
    name: '',
    date: '',
    wochentag: '', 
    beschreibung: '',
    dauertStunden: '', 
  });
  

  const fetchSonderveranstaltungen = async () => {  
    try {
      const res = await axios.get('https://prak-swe.onrender.com/sonderveranstaltung');
      setSonderveranstaltungen(res.data);
      setFilteredSonderveranstaltungen(res.data);
    } catch (error) {
      console.error("Error fetching sonderveranstaltungen:", error);
      alert('Failed to fetch sonderveranstaltungen.'); 
    }
  };

  useEffect(() => {
    fetchSonderveranstaltungen(); 
  }, []);

  useEffect(() => {
    const filtered = sonderveranstaltungen.filter(sv =>
      sv.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredSonderveranstaltungen(filtered);
  }, [filter, sonderveranstaltungen]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewSonderveranstaltung(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formattedDate = newSonderveranstaltung.date.split('-').reverse().join('.');

    const dataToSend = {
        ...newSonderveranstaltung,
        date: formattedDate
    };
    try {
      await axios.post('https://prak-swe.onrender.com/sonderveranstaltung', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      fetchSonderveranstaltungen();
      setShowAddForm(false);
      setNewSonderveranstaltung({
        name: '',
        date: '',
        wochentag: '', 
        beschreibung: '',
        dauertStunden: '', 
      });
      alert('Sonderveranstaltung added successfully!');
    } catch (error) {
        if (error.response) {
          console.error('Server response:', error.response.data);
          alert('Error while add Sonderveranstaltung: ' + error.response.data.message); 
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Did not receive response from server. Please check your network connection.');
        } else {
          console.error('Error:', error.message);
          alert('Unknown error while adding Sonderveranstaltung.');
        }
      }
  };

  

  const handleDeleteClick = async (sonderveranstaltungId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this sonderveranstaltung?')) {
      try {
        await axios.delete(`https://prak-swe.onrender.com/sonderveranstaltung/${sonderveranstaltungId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        fetchSonderveranstaltungen();
        alert('Sonderveranstaltung deleted successfully!');
      } catch (error) {
        console.error('Error deleting sonderveranstaltung:', error);
        alert('Failed to delete sonderveranstaltung.');
      }
    }
  };

  const handleViewStudentsClick = async (sonderveranstaltungId) => {
    try {
      const res = await axios.get(`https://prak-swe.onrender.com/sonderveranstaltung/student/${sonderveranstaltungId}`);
      const studentNames = res.data.map(student => student.name).join(', ');
      alert(`Students registered for this event: ${studentNames}`);
    } catch (error) {
      console.error('Error fetching registered students:', error);
      alert('Failed to fetch registered students.');
    }
  };

  const handleAddStudentClick = async (sonderveranstaltungId) => {
    const token = localStorage.getItem('token');
    const studentId = prompt("Enter student ID to add:"); // Get student ID from user

    if (studentId) {
      try {
        await axios.post('https://prak-swe.onrender.com/sonderveranstaltung/add/student', {
          student_id: studentId,
          sonderveranstaltung_id: sonderveranstaltungId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        alert(`Student added successfully to Sonderveranstaltung ${sonderveranstaltungId}`);
        // Optionally, you can refresh the list of students here if needed
      } catch (error) {
        console.error('Error adding student:', error);
        alert('Failed to add student. Please check the student ID and try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Sonderveranstaltung verwalten</h2>

      <input
        type="text"
        placeholder="Filter by Name"
        value={filter}
        onChange={handleFilterChange}
        className={styles.input}
      />

      <div className={styles.buttonContainer}>
        <button onClick={handleAddClick} className={styles.addButton}>Add Sonderveranstaltung</button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className={styles.form}>
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={newSonderveranstaltung.name} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="date"  
            name="date" 
            placeholder="Datum (TT.MM.JJJJ)" 
            value={newSonderveranstaltung.date} 
            onChange={handleInputChange} 
            required 
          />
          <select 
            name="wochentag"
            value={newSonderveranstaltung.wochentag}
            onChange={handleInputChange}
            required
          >
            <option value="">Wochentag</option>
            <option value="mon">mon</option>
            <option value="tue">tue</option>
            <option value="wed">wed</option>
            <option value="thu">thu</option>
            <option value="fri">fri</option>
          </select>
          <textarea 
            name="beschreibung" 
            placeholder="Beschreibung" 
            value={newSonderveranstaltung.beschreibung} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            type="number" 
            name="dauertStunden" 
            placeholder="Dauer (in Stunden)" 
            value={newSonderveranstaltung.dauertStunden} 
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
            <th>Start Time</th>
            <th>End Time</th>
            <th>Beschreibung</th>
            <th>Mitarbeiter ID</th>
            <th>Raum ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSonderveranstaltungen.map(sv => (
            <tr key={sv.id}>
              <td>{sv.id}</td>
              <td>{sv.name}</td>
              <td>{sv.starttime.split('T')[0]} {sv.starttime.split('T')[1].slice(0, -1)}</td> {/* Format starttime */}
              <td>{sv.endtime.split('T')[0]} {sv.endtime.split('T')[1].slice(0, -1)}</td> {/* Format endtime */}
              <td>{sv.beschreibung}</td>
              <td>{sv.mitarbeiter_id}</td>
              <td>{sv.raum_id}</td>
              <td>
                <button className={styles.updateButton} onClick={() => handleAddStudentClick(sv.id)}>Add Student</button> 
                <button className={styles.updateButton} onClick={() => handleViewStudentsClick(sv.id)}>View Students</button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(sv.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SonderveranstaltungManagement;
