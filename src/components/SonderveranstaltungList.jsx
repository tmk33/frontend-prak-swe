import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/SonderveranstaltungList.module.css'; 
import { useNavigate } from 'react-router-dom';


function SonderveranstaltungList() {
  const [sonderveranstaltungen, setSonderveranstaltungen] = useState([]);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchSonderveranstaltungen = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/sonderveranstaltung');
        setSonderveranstaltungen(res.data);
      } catch (error) {
        console.error("Error fetching sonderveranstaltungen:", error);
        alert("Failed to fetch sonderveranstaltungen.");
      }
    };

    fetchSonderveranstaltungen();
  }, []);

  
  useEffect(() => {
    const fetchDetails = async () => {
      const mitarbeiterPromises = sonderveranstaltungen.map(sv => 
        axios.get(`https://prak-swe.onrender.com/mitarbeiter/${sv.mitarbeiter_id}`)
      );
      const raumPromises = sonderveranstaltungen.map(sv =>
        axios.get(`https://prak-swe.onrender.com/raum/${sv.raum_id}`)
      );

      try {
        const mitarbeiterResponses = await Promise.all(mitarbeiterPromises);
        const raumResponses = await Promise.all(raumPromises);

        const updatedSonderveranstaltungen = sonderveranstaltungen.map((sv, index) => ({
          ...sv,
          mitarbeiter: mitarbeiterResponses[index].data.name,
          raum: raumResponses[index].data.name,
        }));

        setSonderveranstaltungen(updatedSonderveranstaltungen);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    if (sonderveranstaltungen.length > 0) {
      fetchDetails();
    }
  }, [sonderveranstaltungen]); 

  

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>  
        <button onClick={handleBackClick} className={styles.backButton}>Back</button> 
      </div>
      <h1>Sonderveranstaltungen</h1>

      <ul className={styles.list}>
        {sonderveranstaltungen.map(sv => (
          <li key={sv.id} className={styles.listItem}>
            <h3>{sv.name}</h3>
            <p>
              Datum: {new Date(sv.starttime).toLocaleDateString()} <br />
              Zeit: {new Date(sv.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sv.endtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>Beschreibung: {sv.beschreibung}</p>
            <p>Dozent: {sv.mitarbeiter}</p>
            <p>Raum: {sv.raum}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SonderveranstaltungList;
