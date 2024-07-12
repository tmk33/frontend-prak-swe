import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentIdFilter, setStudentIdFilter] = useState('');

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

  return (
    <div>
      <h2>Student verwalten</h2>

      <input
        type="text"
        placeholder="Filter by Student ID"
        value={studentIdFilter}
        onChange={handleStudentIdFilterChange}
      />

      <button>Add Student</button>
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
              <td>{student.geburtsdatum.split('T')[0]}</td> {/* Định dạng ngày */}
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
