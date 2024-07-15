import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/KursList.module.css';
import { useNavigate } from 'react-router-dom';


function KursList() {
  const [kurse, setKurse] = useState([]);
  const [filteredKurse, setFilteredKurse] = useState([]);
  const [filterType, setFilterType] = useState('fachbereich');
  const [filterValue, setFilterValue] = useState('1');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the /login route
  };

  const handleSonderveranstaltungClick = () => {
    navigate('/forall/sonderveranstaltung'); 
  };

  const wochentage = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const zeitfenster = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00'];

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
    fetchKurse(); // Call fetchKurse when the component mounts
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
    console.log(filteredKurse);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginButtonContainer}>
        <button className={styles.loginButton} onClick={handleLoginClick}>
          Login
        </button>
      </div>
        <h1>Kurs Schedule</h1>
        
        <div className={styles.filterSection}>
            <select value={filterType} onChange={handleFilterChange}>
                <option value="none">No Filter</option>
                <option value="fachbereich">By Fachbereich ID</option>
                <option value="dozentId">By Dozent ID</option>
                <option value="dozentName">By Dozent Name</option>
            </select>
            {filterType !== 'none' && (
                <input
                    type={filterType === 'dozentName' ? 'text' : 'number'}
                    placeholder={filterType === 'fachbereich' ? 'Fachbereich ID' : (filterType === 'dozentId' ? 'Dozent ID' : 'Dozent Name')}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                />
            )}
            
        <button className={styles.sonderButton} onClick={handleSonderveranstaltungClick}>
          Sonderveranstaltung
        </button>
      
        </div>

        {/* Schedule Table */}
        <table className={styles.scheduleTable}>
            <thead>
                <tr><th></th>{wochentage.map(tag => <th key={tag}>{tag.toUpperCase()}</th>)}</tr>
            </thead>
            <tbody>
                {zeitfenster.map(zeit => (
                    <tr key={zeit}><th>{zeit}</th>
                        {wochentage.map(tag => {
                            const kurs = filteredKurse.find(k => k.wochentag === tag && k.starttime.slice(0, -3) === zeit.split('-')[0]);
                            return (
                                <td key={tag + zeit}>
                                    {kurs ? (
                                        <div className={styles.kurs}>
                                            <p className={styles.kursName}>{kurs.kurs_name}</p>
                                            <p className={styles.raum}>Raum: {kurs.raum}</p>
                                            <p className={styles.dozent}>Dozent: {kurs.dozent}</p>
                                        </div>
                                    ) : null}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default KursList;
