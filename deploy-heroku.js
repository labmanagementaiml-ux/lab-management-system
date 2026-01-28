// Production-ready server for Heroku deployment
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

// Database setup for production
let db;
const dbPath = path.join(__dirname, 'database', 'lab_management.db');

// Initialize database
function initDatabase() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to SQLite database.');
            createTables();
        }
    });
}

// Create tables if they don't exist
function createTables() {
    db.serialize(() => {
        // Labs table
        db.run(`CREATE TABLE IF NOT EXISTS labs (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            strength INTEGER NOT NULL,
            subject TEXT DEFAULT 'General',
            date TEXT DEFAULT CURRENT_DATE,
            time TEXT DEFAULT '09:00-11:00',
            capacity INTEGER DEFAULT 40,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Classes table
        db.run(`CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            strength INTEGER NOT NULL,
            subject TEXT DEFAULT 'General',
            date TEXT DEFAULT CURRENT_DATE,
            time TEXT DEFAULT '09:00-11:00',
            capacity INTEGER DEFAULT 90,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Lab attendance table
        db.run(`CREATE TABLE IF NOT EXISTS lab_attendance (
            id TEXT PRIMARY KEY,
            labId TEXT NOT NULL,
            studentName TEXT NOT NULL,
            studentId TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Class attendance table
        db.run(`CREATE TABLE IF NOT EXISTS class_attendance (
            id TEXT PRIMARY KEY,
            classId TEXT NOT NULL,
            studentName TEXT NOT NULL,
            studentId TEXT NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('Database tables ready');
    });
}

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
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    db.run(
        "INSERT INTO labs (id, name, subject, date, time, capacity, strength) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, name, subject || 'General', date || new Date().toISOString().split('T')[0], time || '09:00-11:00', capacity || 40, capacity || 40],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, message: 'Lab created successfully' });
        }
    );
});

app.put('/api/labs/:id', (req, res) => {
    const { id } = req.params;
    const { name, subject, date, time, capacity, strength } = req.body;
    
    db.run(
        "UPDATE labs SET name = ?, subject = ?, date = ?, time = ?, capacity = ?, strength = ? WHERE id = ?",
        [name, subject || 'General', date || new Date().toISOString().split('T')[0], time || '09:00-11:00', capacity || strength, strength || capacity, id],
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
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    db.run(
        "INSERT INTO classes (id, name, subject, date, time, capacity, strength) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, name, subject || 'General', date || new Date().toISOString().split('T')[0], time || '09:00-11:00', capacity || 90, capacity || 90],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, message: 'Class created successfully' });
        }
    );
});

app.put('/api/classes/:id', (req, res) => {
    const { id } = req.params;
    const { name, subject, date, time, capacity, strength } = req.body;
    
    db.run(
        "UPDATE classes SET name = ?, subject = ?, date = ?, time = ?, capacity = ?, strength = ? WHERE id = ?",
        [name, subject || 'General', date || new Date().toISOString().split('T')[0], time || '09:00-11:00', capacity || strength, strength || capacity, id],
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
    let query = "SELECT la.*, l.name as lab_name FROM lab_attendance la LEFT JOIN labs l ON la.labId = l.id";
    let params = [];
    
    if (lab_id) {
        query += " WHERE la.labId = ?";
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
    const { labId, studentName, studentId, status, date } = req.body;
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    db.run(
        "INSERT INTO lab_attendance (id, labId, studentName, studentId, status, date) VALUES (?, ?, ?, ?, ?, ?)",
        [id, labId, studentName, studentId, status, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, message: 'Lab attendance recorded successfully' });
        }
    );
});

// API Routes - Class Attendance
app.get('/api/class-attendance', (req, res) => {
    const { class_id, date } = req.query;
    let query = "SELECT ca.*, c.name as class_name FROM class_attendance ca LEFT JOIN classes c ON ca.classId = c.id";
    let params = [];
    
    if (class_id) {
        query += " WHERE ca.classId = ?";
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
    const { classId, studentName, studentId, status, date } = req.body;
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    db.run(
        "INSERT INTO class_attendance (id, classId, studentName, studentId, status, date) VALUES (?, ?, ?, ?, ?, ?)",
        [id, classId, studentName, studentId, status, date],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id, message: 'Class attendance recorded successfully' });
        }
    );
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize database and start server
initDatabase();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: ${dbPath}`);
});

module.exports = app;
