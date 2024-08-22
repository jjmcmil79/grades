import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../axiosConfig';

function Grades() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newGrade, setNewGrade] = useState({ student_id: '', assignment_id: '', score: '' });
  const [editingGrade, setEditingGrade] = useState(null);

  const fetchGrades = async () => {
    try {
      const response = await api.get('http://localhost:3010/api/grades');
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('http://localhost:3010/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get('http://localhost:3010/api/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchStudents();
    fetchAssignments();
  }, []);

  const addGrade = async () => {
    try {
      const response = await api.post('http://localhost:3010/api/grades', newGrade);
      setGrades([...grades, response.data]);
      setNewGrade({ student_id: '', assignment_id: '', score: '' });
    } catch (error) {
      console.error("Error adding grade:", error);
    }
  };

  const deleteGrade = async (id) => {
    try {
      await api.delete(`http://localhost:3010/api/grades/${id}`);
      setGrades(grades.filter(grade => grade.id !== id));
    } catch (error) {
      console.error("Error deleting grade:", error);
    }
  };

  const startEditing = (grade) => {
    setEditingGrade({ ...grade });
  };

  const saveEdit = async () => {
    try {
      const response = await api.put(`http://localhost:3010/api/grades/${editingGrade.id}`, editingGrade);
      setGrades(grades.map(grade => grade.id === editingGrade.id ? response.data : grade));
      setEditingGrade(null);
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  const formatScore = (score) => {
    return score.toFixed(2);
  };

  const getStudentName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown';
  };
  

  const getAssignmentName = (id) => {
    const assignment = assignments.find(a => a.id === id);
    return assignment ? assignment.name : 'Unknown';
  };

  return (
    <div className="Grades">
      <h1>Grades</h1>
      <div>
        <select
          value={newGrade.student_id}
          onChange={(e) => setNewGrade({...newGrade, student_id: e.target.value})}
        >
          <option value="">Select a student</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
          ))}
        </select>
        <select
          value={newGrade.assignment_id}
          onChange={(e) => setNewGrade({...newGrade, assignment_id: e.target.value})}
        >
          <option value="">Select an assignment</option>
          {assignments.map(assignment => (
            <option key={assignment.id} value={assignment.id}>{assignment.name}</option>
          ))}
        </select>
        <input
          type="number"
          value={newGrade.score}
          onChange={(e) => setNewGrade({...newGrade, score: e.target.value})}
          placeholder="Score"
        />
        <button onClick={addGrade}>Add Grade</button>
      </div>
      <h2>Grade List</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Assignment</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(grade => (
            <tr key={grade.id}>
              {editingGrade && editingGrade.id === grade.id ? (
                <>
                  <td>
                    <select
                      value={editingGrade.student_id}
                      onChange={(e) => setEditingGrade({ ...editingGrade, student_id: e.target.value })}
                    >
                      {students.map(student => (
                        <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={editingGrade.assignment_id}
                      onChange={(e) => setEditingGrade({ ...editingGrade, assignment_id: e.target.value })}
                    >
                      {assignments.map(assignment => (
                        <option key={assignment.id} value={assignment.id}>{assignment.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingGrade.score}
                      onChange={(e) => setEditingGrade({ ...editingGrade, score: e.target.value })}
                    />
                  </td>
                  <td>
                    <button onClick={saveEdit}>Save</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{getStudentName(grade.student_id)}</td>
                  <td>{getAssignmentName(grade.assignment_id)}</td>
                  <td>{formatScore(grade.score)}</td>
                  <td>
                    <button onClick={() => startEditing(grade)}>Edit</button>
                    <button onClick={() => deleteGrade(grade.id)}>Delete</button>
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

export default Grades;