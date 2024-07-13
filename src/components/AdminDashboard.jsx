import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/AdminDashboard.module.css';

function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/student" className={styles.link}>Student verwalten</Link></li>
          <li><Link to="/mitarbeiter" className={styles.link}>Mitarbeiter verwalten</Link></li>
          <li><Link to="/kurs" className={styles.link}>Kurs verwalten</Link></li>
          <li><Link to="/sonderveranstaltung" className={styles.link}>Sonderveranstaltung verwalten</Link></li>
          <li><Link to="/raum" className={styles.link}>Raum verwalten</Link></li>
          <li><Link to="/fachbereich" className={styles.link}>Fachbereich verwalten</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard;

