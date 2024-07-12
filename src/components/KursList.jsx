import React, { useState, useEffect } from 'react';
import axios from 'axios';

function KursList() {
  const [kurse, setKurse] = useState([]);
  const [error, setError] = useState(null);
  const [fachbereichId, setFachbereichId] = useState(1); 

  useEffect(() => {
    const fetchKurse = async () => {
      try {
        const response = await axios.get(`https://prak-swe.onrender.com/kurs/fachbereich/${fachbereichId}`);
        setKurse(response.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setKurse([]);
      }
    };

    fetchKurse();
  }, [fachbereichId]); 

  const handleFachbereichIdChange = (event) => {
    setFachbereichId(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="fachbereichId">Fachbereich ID:</label>
        <input
          type="number"
          id="fachbereichId"
          value={fachbereichId}
          onChange={handleFachbereichIdChange}
        />
      </div>

      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Kurs ID</th>
              <th>Kurs Name</th>
              <th>Wochentag</th>
              <th>Start</th>
              <th>End</th>
              <th>Dozent</th>
              <th>Raum</th>
              <th>Fachbereich</th>
            </tr>
          </thead>
          <tbody>
            {kurse.map(kurs => (
              <tr key={kurs.kurs_id}>
                <td>{kurs.kurs_id}</td>
                <td>{kurs.kurs_name}</td>
                <td>{kurs.wochentag}</td>
                <td>{kurs.starttime}</td>
                <td>{kurs.endtime}</td>
                <td>{kurs.dozent}</td>
                <td>{kurs.raum}</td>
                <td>{kurs.fachbereich}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default KursList;
