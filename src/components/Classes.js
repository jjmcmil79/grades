import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../axiosConfig';
import './Classes.css';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '' });
  const [newAssignments, setNewAssignments] = useState({});
  const [editingClass, setEditingClass] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('http://localhost:3010/api/classes');
      const classesWithAssignments = await Promise.all(response.data.map(async (cls) => {
        const assignmentsResponse = await api.get(`http://localhost:3010/api/classes/${cls.id}/assignments`);
        return { ...cls, assignments: assignmentsResponse.data };
      }));
      setClasses(classesWithAssignments);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const addClass = async () => {
    try {
      const response = await api.post('http://localhost:3010/api/classes', newClass);
      setClasses([...classes, { ...response.data, assignments: [] }]);
      setNewClass({ name: '' });
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  const deleteClass = async (id) => {
    try {
      await api.delete(`http://localhost:3010/api/classes/${id}`);
      setClasses(classes.filter(cls => cls.id !== id));
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const startEditingClass = (cls) => {
    setEditingClass({ ...cls });
  };

  const saveEditClass = async () => {
    try {
      const response = await api.put(`http://localhost:3010/api/classes/${editingClass.id}`, editingClass);
      setClasses(classes.map(cls => cls.id === editingClass.id ? { ...response.data, assignments: cls.assignments } : cls));
      setEditingClass(null);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const addAssignment = async (classId) => {
    try {
      const response = await api.post('http://localhost:3010/api/assignments', {
        name: newAssignments[classId],
        class_id: classId
      });
      setClasses(classes.map(cls => 
        cls.id === classId 
          ? { ...cls, assignments: [...cls.assignments, response.data] }
          : cls
      ));
      setNewAssignments({...newAssignments, [classId]: ''});
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const deleteAssignment = async (classId, assignmentId) => {
    try {
      await api.delete(`http://localhost:3010/api/assignments/${assignmentId}`);
      setClasses(classes.map(cls => 
        cls.id === classId
          ? { ...cls, assignments: cls.assignments.filter(a => a.id !== assignmentId) }
          : cls
      ));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const startEditingAssignment = (assignment) => {
    setEditingAssignment({ ...assignment });
  };

  const saveEditAssignment = async () => {
    try {
      const response = await api.put(`http://localhost:3010/api/assignments/${editingAssignment.id}`, editingAssignment);
      setClasses(classes.map(cls => 
        cls.id === editingAssignment.class_id
          ? { ...cls, assignments: cls.assignments.map(a => a.id === editingAssignment.id ? response.data : a) }
          : cls
      ));
      setEditingAssignment(null);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div className="Classes">
      <h1>Classes</h1>
      <div className="add-class">
          <input
            type="text"
            value={newClass.name}
            onChange={(e) => setNewClass({...newClass, name: e.target.value})}
            placeholder="Enter class name"
          />
          <button onClick={addClass}>Add Class</button>
        </div>
      <div className="class-container">
        {classes.map(cls => (
          <div key={cls.id} className="class-block">
            <div className="class-item">
              <h2>{cls.name}</h2>
              <div className="class-buttons">
                <button onClick={() => startEditingClass(cls)}>Edit</button>
                <button onClick={() => deleteClass(cls.id)}>Delete</button>
              </div>
            </div>
            <div className="class-assignments">
              <div className="add-assignment">
                <input
                  type="text"
                  value={newAssignments[cls.id] || ''}
                  onChange={(e) => setNewAssignments({
                    ...newAssignments,
                    [cls.id]: e.target.value
                  })}
                  placeholder="Enter assignment name"
                />
                <button onClick={() => addAssignment(cls.id)}>Add Assignment</button>
              </div>
              {(cls.assignments || []).map(assignment => (
                <div key={assignment.id} className="assignment-item">
                  <span>{assignment.name}</span>
                  <button onClick={() => startEditingAssignment(assignment)}>Edit</button>
                  <button onClick={() => deleteAssignment(cls.id, assignment.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
  
  
}

export default Classes;