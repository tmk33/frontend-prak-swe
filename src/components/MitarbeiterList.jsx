import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MitarbeiterList() {
  const [mitarbeiter, setMitarbeiter] = useState([]);

  useEffect(() => {
    const fetchMitarbeiter = async () => {
      try {
        const res = await axios.get('/mitarbeiter'); // Gọi API /mitarbeiter
        setMitarbeiter(res.data);
      } catch (error) {
        console.error("Error fetching mitarbeiter:", error);
      }
    };

    fetchMitarbeiter();
  }, []);

  return (
    <div>
      <h2>Danh sách nhân viên</h2>
      <ul>
        {mitarbeiter.map(mitarbeiter => (
          <li key={mitarbeiter.id}>
            {mitarbeiter.name} - {mitarbeiter.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MitarbeiterList;
