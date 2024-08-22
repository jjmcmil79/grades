const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM classes ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single class by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM classes WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new class
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO classes (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a class
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      'UPDATE classes SET name = $1 WHERE id = $2 RETURNING *',
      [name, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a class
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM classes WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).json({ message: 'Class deleted' });
    } else {
      res.status(404).json({ message: 'Class not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;