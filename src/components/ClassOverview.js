import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ClassOverview() {
  const [classData, setClassData] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get('http://localhost:3010/api/classes');
        setAllClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchAllClasses();
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      if (id) {
        try {
          const classResponse = await axios.get(`http://localhost:3010/api/classes/${id}`);
          const studentsResponse = await axios.get(`http://localhost:3010/api/classes/${id}/students`);
          const assignmentsResponse = await axios.get(`http://localhost:3010/api/classes/${id}/assignments`);
          const gradesResponse = await axios.get(`http://localhost:3010/api/classes/${id}/grades`);

          setClassData({
            ...classResponse.data,
            students: studentsResponse.data,
            assignments: assignmentsResponse.data,
            grades: gradesResponse.data
          });
        } catch (error) {
          console.error("Error fetching class data:", error);
        }
      }
    };

    fetchClassData();
  }, [id]);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    navigate(`/class/${selectedClassId}`);
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = classData.grades.filter(grade => grade.student_id === studentId);
    const sum = studentGrades.reduce((acc, grade) => acc + grade.score, 0);
    return studentGrades.length > 0 ? sum / studentGrades.length : 0;
  };

  return (
    <div className="ClassOverview">
      <h1>Class Overview</h1>
      <select id = "selectClass" onChange={handleClassChange} value={id || ''}>
        <option value="">Select a class</option>
        {allClasses.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>
  
      {classData && (
        <>
          <h2>{classData.name}</h2>
          <table id= "classTable">
            <thead>
              <tr>
                <th>Student</th>
                {classData.assignments.map(assignment => (
                  <th key={assignment.id}>{assignment.name}</th>
                ))}
                <th>Average</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {classData.students.map(student => {
                const average = calculateStudentAverage(student.id);
                return (
                  <tr key={student.id}>
                    <td>{student.first_name}</td>
                    <td>{student.last_name}</td>
                    {classData.assignments.map(assignment => {
                      const grade = classData.grades.find(g => g.assignment_id === assignment.id && g.student_id === student.id);
                      return <td key={assignment.id}>{grade ? grade.score : 'N/A'}</td>;
                    })}
                    <td>{average.toFixed(2)}</td>
                    <td>{getLetterGrade(average)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
  
}

export default ClassOverview;