const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Database connection
const dbPath = path.join(__dirname, 'database', 'lab_management.db');
const db = new sqlite3.Database(dbPath);

// API Routes - Labs
app.get('/api/labs', (req, res) => {
    db.all("SELECT * FROM labs ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/labs', (req, res) => {
    const { name, subject, date, time, capacity } = req.body;
    db.run(
        "INSERT INTO labs (name, subject, date, time, capacity) VALUES (?, ?, ?, ?, ?)",
        [name, subject, date, time, capacity],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Lab created successfully' });
        }
    );
});

app.put('/api/labs/:id', (req, res) => {
    const { id } = req.params;
    const { name, subject, date, time, capacity } = req.body;
    db.run(
        "UPDATE labs SET name = ?, subject = ?, date = ?, time = ?, capacity = ? WHERE id = ?",
        [name, subject, date, time, capacity, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Lab updated successfully' });
        }
    );
});

app.delete('/api/labs/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM labs WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Lab deleted successfully' });
    });
});

// API Routes - Classes
app.get('/api/classes', (req, res) => {
    db.all("SELECT * FROM classes ORDER BY created_at DESC", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/classes', (req, res) => {
    const { name, subject, date, time, capacity } = req.body;
    db.run(
        "INSERT INTO classes (name, subject, date, time, capacity) VALUES (?, ?, ?, ?, ?)",
        [name, subject, date, time, capacity],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Class created successfully' });
        }
    );
});

app.put('/api/classes/:id', (req, res) => {
    const { id } = req.params;
    const { name, subject, date, time, capacity } = req.body;
    db.run(
        "UPDATE classes SET name = ?, subject = ?, date = ?, time = ?, capacity = ? WHERE id = ?",
        [name, subject, date, time, capacity, id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Class updated successfully' });
        }
    );
});

app.delete('/api/classes/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM classes WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Class deleted successfully' });
    });
});

// API Routes - Lab Attendance
app.get('/api/lab-attendance', (req, res) => {
    const { lab_id, date } = req.query;
    let query = "SELECT la.*, l.name as lab_name FROM lab_attendance la JOIN labs l ON la.lab_id = l.id";
    let params = [];
    
    if (lab_id) {
        query += " WHERE la.lab_id = ?";
        params.push(lab_id);
    }
    if (date) {
        query += params.length > 0 ? " AND la.date = ?" : " WHERE la.date = ?";
        params.push(date);
    }
    
    query += " ORDER BY la.created_at DESC";
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/lab-attendance', (req, res) => {
    const { lab_id, student_name, student_id, status, date } = req.body;
    db.run(
        "INSERT INTO lab_attendance (lab_id, student_name, student_id, status, date) VALUES (?, ?, ?, ?, ?)",
        [lab_id, student_name, student_id, status, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Lab attendance recorded successfully' });
        }
    );
});

// API Routes - Class Attendance
app.get('/api/class-attendance', (req, res) => {
    const { class_id, date } = req.query;
    let query = "SELECT ca.*, c.name as class_name FROM class_attendance ca JOIN classes c ON ca.class_id = c.id";
    let params = [];
    
    if (class_id) {
        query += " WHERE ca.class_id = ?";
        params.push(class_id);
    }
    if (date) {
        query += params.length > 0 ? " AND ca.date = ?" : " WHERE ca.date = ?";
        params.push(date);
    }
    
    query += " ORDER BY ca.created_at DESC";
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/class-attendance', (req, res) => {
    const { class_id, student_name, student_id, status, date } = req.body;
    db.run(
        "INSERT INTO class_attendance (class_id, student_name, student_id, status, date) VALUES (?, ?, ?, ?, ?)",
        [class_id, student_name, student_id, status, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, message: 'Class attendance recorded successfully' });
        }
    );
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Database:', dbPath);
});

module.exports = app;
