const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.API_PORT;

app.use(cors());
app.use(express.json());

// Import routes
// const classesRoutes = require('./routes/classes');
// const studentsRoutes = require('./routes/students');
// const gradesRoutes = require('./routes/grades');

// Use routes
// app.use('/api/classes', classesRoutes);
// app.use('/api/students', studentsRoutes);
// app.use('/api/grades', gradesRoutes);


// Get all students
app.get('/students', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/createstudent', async (req, res) => {
  const { name } = req.body;
  console.log("Received request to add student:", name);
  try {
    const result = await db.query(
      'INSERT INTO students (name) VALUES ($1) RETURNING *',
      [name]
    );
    console.log("Database result:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding student to database:", error);
    res.status(400).json({ message: error.message });
  }
});


//=================== Listening on Port ==============================//

//local host
// httpServer.listen(process.env.API_PORT, () => {
//   console.log(`Server is listening on port: ${process.env.API_PORT}`);
// });

app.listen(process.env.API_PORT, () => {
  console.log(`Server is listening on port: ${process.env.API_PORT}`);
});


// //Error handling
app.use((req, res) => {
  res.status(404).send("Not Found");
});