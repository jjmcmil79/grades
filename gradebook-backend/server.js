
require("dotenv").config()
const express = require("express")
const app = express()
const db = require("./config/db")
const cors = require("cors")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// const crypto = require('crypto');
// const randomToken = crypto.randomBytes(64).toString('hex');
// console.log(randomToken);

app.use(cors())

app.use(express.json())
app.use(express.static("public"));

//===================================Auth Routes==================================//

const authMiddleware = require('./authMiddleware');

app.get('/api/protected-route', authMiddleware, (req, res) => {
  // This route is now protected and can only be accessed with a valid token
  res.json({ message: 'You have access to this protected route' });
});


//===================================Students Routes==================================//

// Get all students
app.get('/api/students', authMiddleware, async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM students ORDER BY last_name, first_name');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching students' });
    }
  });
  
  // Get a specific student
  app.get('/api/students/:id', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching the student' });
    }
  });
  
  // Create a new student
  app.post('/api/students', async (req, res) => {
    const { first_name, last_name, email, phone_number } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO students (first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, email, phone_number]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the student' });
    }
  });
  
  // Update a student
  app.put('/api/students/:id', async (req, res) => {
    const { first_name, last_name, email, phone_number } = req.body;
    try {
      const result = await db.query(
        'UPDATE students SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE id = $5 RETURNING *',
        [first_name, last_name, email, phone_number, req.params.id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the student' });
    }
  });
  
  // Delete a student
  app.delete('/api/students/:id', async (req, res) => {
    try {
      const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [req.params.id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Student not found' });
      } else {
        res.json({ message: 'Student deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the student' });
    }
  });
  

app.post('/api/students/import', async (req, res) => {
    try {
      const students = req.body;
    //   console.log(students);
      for (let student of students) {
        await db.query('INSERT INTO students (first_name, last_name, email, phone_number, user_id) VALUES ($1, $2, $3, $4, $5)', 
          [student.first_name, student.last_name, student.email, student.phone_number, student.user_id]);
      }
      res.status(200).json({ message: 'Students imported successfully' });
    } catch (error) {
      console.error('Error importing students:', error);
      res.status(500).json({ error: 'Error importing students' });
    }
  });
  
  

//===================================Grades Routes==================================//

// GET all grades
app.get("/api/grades", authMiddleware, async (_, res) => {
    try {
        const result = await db.query('SELECT * FROM grades');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET a single grade
app.get("/api/grades/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM grades WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Grade not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST a new grade
app.post("/api/grades", async (req, res) => {
    try {
        const { score, student_id, assignment_id } = req.body;
        const result = await db.query(
            'INSERT INTO grades (score, student_id, assignment_id) VALUES ($1, $2, $3) RETURNING *',
            [score, student_id, assignment_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT (update) a grade
app.put("/api/grades/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { score, student_id, assignment_id } = req.body;
        const result = await db.query(
            'UPDATE grades SET score = $1, student_id = $2, assignment_id = $3 WHERE id = $4 RETURNING *',
            [score, student_id, assignment_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Grade not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE a grade
app.delete("/api/grades/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('DELETE FROM grades WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Grade not found" });
        }
        res.json({ message: "Grade deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//===================================Classes Routes==================================//
// GET all classes
app.get("/api/classes", authMiddleware, async (_, res) => {
    try {
        const result = await db.query('SELECT * FROM classes');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET a single class
app.get("/api/classes/:id", authMiddleware, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM classes WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST a new class
app.post("/api/classes", async (req, res) => {
    try {
        const { name } = req.body;
        const result = await db.query(
            'INSERT INTO classes (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT (update) a class
app.put("/api/classes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const result = await db.query(
            'UPDATE classes SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE a class
app.delete("/api/classes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('DELETE FROM classes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Class not found" });
        }
        res.json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

//===================================Students Routes==================================//

// GET all assignments
app.get("/api/assignments", async (_, res) => {
    try {
        const result = await db.query('SELECT * FROM assignments');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET a single assignment
app.get("/api/assignments/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM assignments WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST a new assignment
app.post("/api/assignments", async (req, res) => {
    try {
        const { name, class_id } = req.body;
        const result = await db.query(
            'INSERT INTO assignments (name, class_id) VALUES ($1, $2) RETURNING *',
            [name, class_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT (update) an assignment
app.put("/api/assignments/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { name, class_id } = req.body;
        const result = await db.query(
            'UPDATE assignments SET name = $1, class_id = $2 WHERE id = $3 RETURNING *',
            [name, class_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE an assignment
app.delete("/api/assignments/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('DELETE FROM assignments WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Assignment not found" });
        }
        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
//===================================Class Overview Routes==================================//

//GET ALL CLASSES
app.get('/api/classes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM classes');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//GET A CLASS
app.get('/api/classes/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM classes WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//GET STUDENTS FOR A CLASS
app.get('/api/classes/:id/students', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT students.* FROM students JOIN student_classes ON students.id = student_classes.student_id WHERE student_classes.class_id = $1',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//GET ASSIGNMENTS FOR A CLASS
app.get('/api/classes/:id/assignments', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM assignments WHERE class_id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//GET GRADES FOR A CLASS
app.get('/api/classes/:id/grades', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT grades.* FROM grades JOIN assignments ON grades.assignment_id = assignments.id WHERE assignments.class_id = $1',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//===================================Student Overview Routes==================================//
//GET ALL STUDENTS
app.get('/api/students', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM students');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
 //GET A STUDENT
  app.get('/api/students/:id', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  //GET CLASSES FOR A STUDENT
  app.get('/api/students/:id/classes', async (req, res) => {
    try {
      const result = await db.query(
        'SELECT classes.* FROM classes JOIN student_classes ON classes.id = student_classes.class_id WHERE student_classes.student_id = $1',
        [req.params.id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  //GET ASSIGNMENTS FOR A STUDENT
  app.get('/api/students/:id/grades', async (req, res) => {
    try {
      const result = await db.query(
        'SELECT grades.*, assignments.name AS assignment_name, assignments.class_id FROM grades JOIN assignments ON grades.assignment_id = assignments.id WHERE grades.student_id = $1',
        [req.params.id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  //===================================Signup Routes==================================//

  app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db.query(
        'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email',
        [firstName, lastName, email, hashedPassword]
      );
      console.log(result.rows);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred during signup' });
    }
  });

  //===================================Login Routes==================================//

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  });
  

// Listen for connections on specified port
app.listen(process.env.API_PORT, () => {
    console.log(`Server is listening on port: ${process.env.API_PORT}`)
})


//Error handling
app.use((req, res) => {
    res.status(404).send("Not Found")
})
