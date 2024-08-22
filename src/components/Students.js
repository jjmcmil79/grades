import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import api from '../axiosConfig';


const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumber;
};


function Students() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ first_name: '', last_name: '', phone_number: '', email: '' });
  const [editingStudent, setEditingStudent] = useState(null);

  const sortStudents = useCallback((studentsArray) => {
    return [...studentsArray].sort((a, b) => {
      const fullNameA = `${a.first_name} ${a.last_name}`;
      const fullNameB = `${b.first_name} ${b.last_name}`;
      return fullNameA.localeCompare(fullNameB);
    });
  }, []);
  

  const fetchStudents = async () => {
    try {
      const response = await api.get('http://localhost:3010/api/students');
      setStudents(sortStudents(response.data));
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (newStudent.name.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:3010/api/createstudent/', newStudent);
        if (response.status === 201) {
          setStudents(prevStudents => sortStudents([...prevStudents, response.data]));
          setNewStudent({ first_name: '', last_name: '', phone_number: '', email: '' });
        }
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:3010/api/students/${id}`);
      setStudents(prevStudents => prevStudents.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const startEditing = (student) => {
    setEditingStudent({ ...student });
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3010/api/students/${editingStudent.id}`, editingStudent);
      setStudents(prevStudents => sortStudents(
        prevStudents.map(student => student.id === editingStudent.id ? response.data : student)
      ));
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className="Students">
      <h1>Students</h1>
      <div>
        <input
          type="text"
          value={newStudent.first_name}
          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
          placeholder="Enter student name"
        />
        <input
          type="text"
          value={newStudent.last_name}
          onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
          placeholder="Enter student name"
        />
        <input
          type="text"
          value={newStudent.phone_number}
          onChange={(e) => setNewStudent({...newStudent, phone_number: e.target.value})}
          placeholder="Enter phone number"
        />
        <input
          type="email"
          value={newStudent.email}
          onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
          placeholder="Enter email"
        />
        <button onClick={addStudent}>Add Student</button>
      </div>
      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              {editingStudent && editingStudent.id === student.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.first_name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, first_name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.last_name}
                      onChange={(e) => setEditingStudent({ ...editingStudent, last_name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingStudent.phone_number}
                      onChange={(e) => setEditingStudent({ ...editingStudent, phone_number: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={saveEdit}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.first_name}</td>
                  <td>{student.last_name}</td>
                  <td>{formatPhoneNumber(student.phone_number)}</td>
                  <td>{student.email}</td>
                  <td>
                    <button onClick={() => startEditing(student)}>Edit</button>
                    <button onClick={() => deleteStudent(student.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;