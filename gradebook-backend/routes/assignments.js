const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, c.name as class_name 
      FROM assignments a 
      JOIN classes c ON a.class_id = c.id 
      ORDER BY c.name, a.name
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, c.name as class_name 
      FROM assignments a 
      JOIN classes c ON a.class_id = c.id 
      WHERE a.id = $1
    `, [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new assignment
router.post('/', async (req, res) => {
  const { name, class_id } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO assignments (name, class_id) VALUES ($1, $2) RETURNING *',
      [name, class_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an assignment
router.put('/:id', async (req, res) => {
  const { name, class_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE assignments SET name = $1, class_id = $2 WHERE id = $3 RETURNING *',
      [name, class_id, req.params.id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM assignments WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).json({ message: 'Assignment deleted' });
    } else {
      res.status(404).json({ message: 'Assignment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;