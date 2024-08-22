import React from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import Classes from './components/Classes';
import Students from './components/Students';
import Grades from './components/Grades';
import ClassOverview from './components/ClassOverview';
import StudentOverview from './components/StudentOverview';
import ImportStudents from './components/ImportStudents';
import Auth from './components/Auth';
import './theme.css';
// import './App.css';
import logo from './images/logo.png';
import { AuthProvider } from './AuthContext';
import Logout from './components/Logout';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Gradebook</h1>
      <img src={logo} alt="Balanced Believer Ministries Logo" className="company-logo" />
      
      {/* <Link to="/auth" className="auth-link">Login / Sign Up</Link> */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/classes">Classes</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/grades">Grades</Link></li>
          <li><Link to="/class-overview">Class Overview</Link></li>
          <li><Link to="/student-overview">Student Overview</Link></li>
          <li><Link to="/import-students">Import Students</Link></li>
          <li><Link to="/auth">Login / Sign Up</Link></li>
          <li><Link to="/logout">Logout</Link></li>
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
        <Route path="/import-students" element={<ImportStudents />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;