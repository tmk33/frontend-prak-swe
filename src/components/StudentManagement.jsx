import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import styles from '../css/StudentManagement.module.css';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    geburtsdatum: '',
    fachbereich_id: '',
    semester: '',
  });
  const navigate = useNavigate(); // Sử dụng useNavigate hook

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get('https://prak-swe.onrender.com/student');
        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.id.toString().includes(studentIdFilter)
    );
    setFilteredStudents(filtered);
  }, [studentIdFilter, students]);

  const handleStudentIdFilterChange = (event) => {
    setStudentIdFilter(event.target.value);
  };

  const handleAddStudentClick = () => {
    setShowAddStudentForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewStudent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token'); 
    try {
      const res = await axios.post('https://prak-swe.onrender.com/student', newStudent, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setStudents([...students, res.data]);
      setFilteredStudents([...filteredStudents, res.data]);
      setShowAddStudentForm(false);
      alert('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  const handleUpdateClick = (studentId) => {
    navigate(`/student/edit/${studentId}`); // Chuyển hướng đến trang chỉnh sửa
  };

  const handleDeleteClick = async (studentId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://prak-swe.onrender.com/student/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStudents(students.filter(student => student.id !== studentId));
        setFilteredStudents(filteredStudents.filter(student => student.id !== studentId));
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student.');
      }
    }
  };
  return (
    <div className={styles.container}>
      <h2>Student verwalten</h2>

      <input
        type="text"
        placeholder="Filter by Student ID"
        value={studentIdFilter}
        onChange={handleStudentIdFilterChange}
        className={styles.input}
      />

      <div className={styles.buttonContainer}>
        <button onClick={handleAddStudentClick} className={styles.addButton}>Add Student</button>
      </div>

      {showAddStudentForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleInputChange} required />
          <input type="date" name="geburtsdatum" placeholder="Geburtsdatum" value={newStudent.geburtsdatum} onChange={handleInputChange} required />
          <input type="number" name="fachbereich_id" placeholder="Fachbereich ID" value={newStudent.fachbereich_id} onChange={handleInputChange} required />
          <input type="number" name="semester" placeholder="Semester" value={newStudent.semester} onChange={handleInputChange} required />
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
            <th>Fachbereich ID</th>
            <th>Semester</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.geburtsdatum.split('T')[0]}</td>
              <td>{student.fachbereich_id}</td>
              <td>{student.semester}</td>
              <td>
                <button onClick={() => handleUpdateClick(student.id)}>Update</button>
                <button onClick={() => handleDeleteClick(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentManagement;
