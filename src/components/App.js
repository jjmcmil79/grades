import React from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import Classes from './components/Classes';
import Students from './components/Students';
import Grades from './components/Grades';
import ClassOverview from './components/ClassOverview';
import StudentOverview from './components/StudentOverview';
import './App.css';
import logo from './logo.png';

function Home() {
  return <h1>Welcome to the Gradebook</h1>;
}

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/classes">Classes</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/grades">Grades</Link></li>
          <li><Link to="/class-overview">Class Overview</Link></li>
          <li><Link to="/student-overview">Student Overview</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/classes" element={<Classes />} />
        <Route path="/students" element={<Students />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/class-overview" element={<ClassOverview />} />
        <Route path="/class/:id" element={<ClassOverview />} />
        <Route path="/student-overview" element={<StudentOverview />} />
        <Route path="/student/:id" element={<StudentOverview />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;