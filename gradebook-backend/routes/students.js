const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all students
router.get('/', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single student by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new student
// router.post('/', async (req, res) => {
//   const { name } = req.body;
//   try {
//     const result = await db.query(
//       'INSERT INTO students (name) VALUES ($1) RETURNING *',
//       [name]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.post('/', async (req, res) => {
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


// Update a student
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE students SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).json({ message: 'Student deleted' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;