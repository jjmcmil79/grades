const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Import routes
const classesRoutes = require('./routes/classes');
const studentsRoutes = require('./routes/students');
const assignmentsRoutes = require('./routes/assignments');
const gradesRoutes = require('./routes/grades');

// Use routes
app.use('/api/classes', classesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/grades', gradesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});