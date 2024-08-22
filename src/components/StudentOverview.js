import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import certificateTemplate from '../images/cert.png';


function StudentOverview() {
  const [studentData, setStudentData] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const response = await api.get('http://localhost:3010/api/students');
        setAllStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchAllStudents();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (id) {
        try {
          const studentResponse = await api.get(`http://localhost:3010/api/students/${id}`);
          const classesResponse = await api.get(`http://localhost:3010/api/students/${id}/classes`);
          const gradesResponse = await api.get(`http://localhost:3010/api/students/${id}/grades`);

          setStudentData({
            ...studentResponse.data,
            classes: classesResponse.data,
            grades: gradesResponse.data
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
    };

    fetchStudentData();
  }, [id]);

  const calculateWeightedGPA = () => {
    const classGPAs = studentData.classes.map(cls => {
      const classGrades = studentData.grades.filter(grade => grade.class_id === cls.id);
      const classAverage = classGrades.reduce((sum, grade) => sum + grade.score, 0) / classGrades.length;
      return { gpa: classAverage / 25, credits: 4 }; // Assuming each class is worth 4 credits
    });
  
    const totalWeightedGPA = classGPAs.reduce((sum, cls) => sum + (cls.gpa * cls.credits), 0);
    const totalCredits = classGPAs.reduce((sum, cls) => sum + cls.credits, 0);
  
    return totalWeightedGPA / totalCredits;
  };

  const handleStudentChange = (event) => {
    const selectedStudentId = event.target.value;
    navigate(`/student/${selectedStudentId}`);
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getGPAGrade = (gpa) => {
    if (gpa >= 4.0) return 'A';
    if (gpa >= 3.7) return 'A-';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.3) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.7) return 'C-';
    if (gpa >= 1.3) return 'D';
    return 'F';
  };

  const calculateClassAverage = (classId) => {
    const classGrades = studentData.grades.filter(grade => grade.class_id === classId);
    const sum = classGrades.reduce((acc, grade) => acc + grade.score, 0);
    return classGrades.length > 0 ? sum / classGrades.length : 0;
  };

  

  const isClassComplete = (classId) => {
    const classAssignments = studentData.grades.filter(grade => grade.class_id === classId);
    return classAssignments.every(assignment => assignment.score !== null);
  };

  const generateCertificate = (studentFName, studentLName, className) => {
    const pdf = new jsPDF('landscape');
    const studentName = studentFName + studentLName;
    
    pdf.addImage(certificateTemplate, 'PNG', 0, 0, 297, 210);
    
    pdf.setFontSize(40);
    pdf.setTextColor(0, 0, 0);
    pdf.text(studentName, 150, 100, { align: 'center' });
    
    pdf.setFontSize(20);
    pdf.text(`for completing ${className}`, 150, 120, { align: 'center' });
    
    pdf.save(`${studentName}_${className}_Certificate.pdf`);
  };
  
  return (
    <div className="StudentOverview">
      <h1>Student Overview</h1>
      <select onChange={handleStudentChange} value={id || ''}>
        <option value="">Select a student</option>
        {allStudents.map(student => (
          <option key={student.id} value={student.id}>{student.first_name} {student.last_name}</option>
        ))}
      </select>

      {studentData && (
        <>
           <div style={{ float: 'right', textAlign: 'right', padding: '20px' }}>
          <h3>Overall GPA: {calculateWeightedGPA().toFixed(2)}</h3>
          <h3>Overall Grade: {getGPAGrade(calculateWeightedGPA())}</h3>
        </div>
          <h2>{studentData.first_name} {studentData.last_name}</h2>
          <p>Phone: {studentData.phone_number}</p>
          <p>Email: {studentData.email}</p>
          <h3>Classes and Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Assignment</th>
                <th>Score</th>
                <th>Average</th>
                <th>Grade</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {studentData.classes.map(cls => {
                const classGrades = studentData.grades.filter(grade => grade.class_id === cls.id);
                const average = calculateClassAverage(cls.id);
                return (
                  <React.Fragment key={cls.id}>
                    <tr>
                      <td rowSpan={classGrades.length + 1}>{cls.name}</td>
                      <td colSpan={2}></td>
                      <td rowSpan={classGrades.length + 1}>{average.toFixed(2)}</td>
                      <td rowSpan={classGrades.length + 1}>{getLetterGrade(average)}</td>
                      <td rowSpan={classGrades.length + 1}>
                        {isClassComplete(cls.id) && (
                          <button onClick={() => generateCertificate(studentData.first_name, studentData.last_name, cls.name)}>
                            Generate Certificate
                          </button>
                        )}
                      </td>
                    </tr>
                    {classGrades.map(grade => (
                      <tr key={grade.id}>
                        <td>{grade.assignment_name}</td>
                        <td>{grade.score}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default StudentOverview;