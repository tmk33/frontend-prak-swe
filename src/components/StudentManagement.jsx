import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const token = localStorage.getItem('token'); // Get admin token from localStorage
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

  return (
    <div>
      <h2>Student verwalten</h2>

      <input
        type="text"
        placeholder="Filter by Student ID"
        value={studentIdFilter}
        onChange={handleStudentIdFilterChange}
      />


      <button onClick={handleAddStudentClick}>Add Student</button>

      {showAddStudentForm && (
        <form onSubmit={handleSubmit}>
          {/* Input fields for name, email, geburtsdatum, fachbereich_id, semester */}
          <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleInputChange} />
            <input type="date" name="geburtsdatum" placeholder="Geburtsdatum" value={newStudent.geburtsdatum} onChange={handleInputChange} />
            <input type="number" name="fachbereich_id" placeholder="Fachbereich ID" value={newStudent.fachbereich_id} onChange={handleInputChange} />
            <input type="number" name="semester" placeholder="Semester" value={newStudent.semester} onChange={handleInputChange} />
          <button type="submit">Add</button>
        </form>
      )}
      <button>Update Student</button>
      <button>Delete Student</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Geburtsdatum</th>
            <th>Fachbereich ID</th>
            <th>Semester</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentManagement;
