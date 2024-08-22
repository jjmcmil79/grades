const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all grades
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.id, g.score, s.name as student_name, a.name as assignment_name, c.name as class_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN assignments a ON g.assignment_id = a.id
      JOIN classes c ON a.class_id = c.id
      ORDER BY s.name, c.name, a.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single grade by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.id, g.score, s.name as student_name, a.name as assignment_name, c.name as class_name
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN assignments a ON g.assignment_id = a.id
      JOIN classes c ON a.class_id = c.id
      WHERE g.id = $1
    `, [req.params.id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new grade
router.post('/', async (req, res) => {
  const { score, student_id, assignment_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO grades (score, student_id, assignment_id) VALUES ($1, $2, $3) RETURNING *',
      [score, student_id, assignment_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a grade
router.put('/:id', async (req, res) => {
  const { score } = req.body;
  try {
    const result = await db.query(
      'UPDATE grades SET score = $1 WHERE id = $2 RETURNING *',
      [score, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a grade
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM grades WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).json({ message: 'Grade deleted' });
    } else {
      res.status(404).json({ message: 'Grade not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;