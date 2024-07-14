import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/MitarbeiterManagement.module.css'; 

function MitarbeiterManagement() {
  const [mitarbeiter, setMitarbeiter] = useState([]);
  const [filteredMitarbeiter, setFilteredMitarbeiter] = useState([]);
  const [mitarbeiterIdFilter, setMitarbeiterIdFilter] = useState('');
  const [showAddMitarbeiterForm, setShowAddMitarbeiterForm] = useState(false);
  const [newMitarbeiter, setNewMitarbeiter] = useState({
    name: '',
    email: '',
    geburtsdatum: '',
    rolle: '',
  });
  const [showKrankmeldungForm, setShowKrankmeldungForm] = useState({}); // State để theo dõi form nào đang mở
  const [krankmeldungResponse, setKrankmeldungResponse] = useState(null); // Thêm state để lưu trữ response


  const navigate = useNavigate();

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/mitarbeiter');
        setMitarbeiter(res.data);
        setFilteredMitarbeiter(res.data);
      } catch (error) {
        console.error("Error fetching mitarbeiter:", error);
      }
    };

    fetchMitarbeiter();
  }, []);

  useEffect(() => {
    const filtered = mitarbeiter.filter(mitarbeiter =>
      mitarbeiter.id.toString().includes(mitarbeiterIdFilter)
    );
    setFilteredMitarbeiter(filtered);
  }, [mitarbeiterIdFilter, mitarbeiter]);

  const handleMitarbeiterIdFilterChange = (event) => {
    setMitarbeiterIdFilter(event.target.value);
  };

  const handleAddMitarbeiterClick = () => {
    setShowAddMitarbeiterForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMitarbeiter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('https://prak-swe.onrender.com/mitarbeiter', newMitarbeiter, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setMitarbeiter([...mitarbeiter, res.data]);
      setFilteredMitarbeiter([...filteredMitarbeiter, res.data]);
      setShowAddMitarbeiterForm(false);
      alert('Mitarbeiter added successfully!');
    } catch (error) {
      console.error('Error adding mitarbeiter:', error);
      alert('Failed to add mitarbeiter.');
    }
  };

  const handleKrankmeldungClick = (mitarbeiterId) => {
    setShowKrankmeldungForm(prevState => ({
      ...prevState,
      [mitarbeiterId]: !prevState[mitarbeiterId] // Đảo ngược trạng thái hiển thị form
    }));
  };

  const handleKrankmeldungSubmit = async (mitarbeiterId, event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const wochentag = event.target.wochentag.value;
    const date = event.target.date.value;

    try {
      const res = await axios.post('https://prak-swe.onrender.com/krankmeldung', {
        mitarbeiterId,
        wochentag,
        date,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setKrankmeldungResponse(res.data); // Lưu response vào state
      setShowKrankmeldungForm(prevState => ({
        ...prevState,
        [mitarbeiterId]: false // Đóng form sau khi gửi thành công
      }));
    } catch (error) {
      console.error('Error sending Krankmeldung:', error);
      alert('Failed to send Krankmeldung.');
    }
  };

  

  return (
    <div className={styles.container}>
      <h1>Mitarbeiter verwalten</h1>
      {krankmeldungResponse && ( // Hiển thị response nếu có
        <div className={styles.response}>
          <h3>Krankmeldung Response:</h3>
          <pre>{JSON.stringify(krankmeldungResponse, null, 2)}</pre>
        </div>
      )}
      <input
        type="text"
        placeholder="Filter by Mitarbeiter ID"
        value={mitarbeiterIdFilter}
        onChange={handleMitarbeiterIdFilterChange}
        className={styles.input}
      />

      <div className={styles.buttonContainer}>
        <button onClick={handleAddMitarbeiterClick} className={styles.addButton}>Add Mitarbeiter</button>
      </div>

      {showAddMitarbeiterForm && (
            <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Add Mitarbeiter</h2>
            <input type="text" name="name" placeholder="Name" value={newMitarbeiter.name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={newMitarbeiter.email} onChange={handleInputChange} required />
            <input type="date" name="geburtsdatum" placeholder="Geburtsdatum" value={newMitarbeiter.geburtsdatum} onChange={handleInputChange} required />
            <select name="rolle" value={newMitarbeiter.rolle} onChange={handleInputChange} required>
                <option value="">Select Rolle</option>
                <option value="Dozent">Dozent</option>
                <option value="Admin">Admin</option>
                <option value="Marketing">Marketing</option>
            </select>
            <button type="submit">Add</button>
            </form>
        )}
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Geburtsdatum</th>
            <th>Rolle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMitarbeiter.map(mitarbeiter => (
            <React.Fragment key={mitarbeiter.id}>
              <tr>
              <td>{mitarbeiter.id}</td>
              <td>{mitarbeiter.name}</td>
              <td>{mitarbeiter.email}</td>
              <td>{mitarbeiter.geburtsdatum.split('T')[0]}</td> 
              <td>{mitarbeiter.rolle}</td>
              <td>
                <button className={styles.updateButton} onClick={() => handleKrankmeldungClick(mitarbeiter.id)}>Krankmeldung</button> 
              </td>
              </tr>
              {showKrankmeldungForm[mitarbeiter.id] && ( 
                <tr>
                <td colSpan="7"> 
                  <form onSubmit={(e) => handleKrankmeldungSubmit(mitarbeiter.id, e)} className={styles.krankmeldungForm}> 
                    <input type="text" name="wochentag" placeholder="Wochentag (mon, tue, wed,...)" required />
                    <input type="date" name="date" placeholder="Date (DD-MM-YYYY)" required />
                    <button type="submit">Submit</button>
                  </form>
                </td>
              </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MitarbeiterManagement;
