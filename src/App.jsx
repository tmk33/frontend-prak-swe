import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import KursList from './components/KursList'; // Import component KursList
import AdminDashboard from './components/AdminDashboard';
import StudentManagement from './components/StudentManagement';
import MitarbeiterManagement from './components/MitarbeiterManagement';
import KursManagement from './components/KursManagement';
import SonderveranstaltungManagement from './components/SonderveranstaltungManagement';
import RaumManagement from './components/RaumManagement';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}> 
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentManagement />} />
          <Route path="/mitarbeiter" element={<MitarbeiterManagement />} />
          <Route path="/kurs" element={<KursManagement />} />
          <Route path="/sonderveranstaltung" element={<SonderveranstaltungManagement />} />
          <Route path="/raum" element={<RaumManagement />} />
        </Route>
        <Route path="/" element={<KursList />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
