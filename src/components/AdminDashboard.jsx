// File: AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/student">Student verwalten</Link></li>
          <li><Link to="/mitarbeiter">Mitarbeiter verwalten</Link></li>
          <li><Link to="/kurs">Kurs verwalten</Link></li>
          <li><Link to="/sonderveranstaltung">Sonderveranstaltung verwalten</Link></li>
          <li><Link to="/raum">Raum verwalten</Link></li>
          <li><Link to="/fachbereich">Fachbereich verwalten</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard;
