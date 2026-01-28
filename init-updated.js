const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, 'lab_management.db');
const db = new sqlite3.Database(dbPath);

// Drop existing tables and recreate with correct schema
db.serialize(() => {
    // Drop tables if they exist
    db.run("DROP TABLE IF EXISTS labs");
    db.run("DROP TABLE IF EXISTS classes");
    db.run("DROP TABLE IF EXISTS lab_attendance");
    db.run("DROP TABLE IF EXISTS class_attendance");

    // Labs table - matching original structure
    db.run(`CREATE TABLE labs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        strength INTEGER NOT NULL,
        subject TEXT DEFAULT 'General',
        date TEXT DEFAULT CURRENT_DATE,
        time TEXT DEFAULT '09:00-11:00',
        capacity INTEGER DEFAULT 40,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Classes table - matching original structure
    db.run(`CREATE TABLE classes (
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
    db.run(`CREATE TABLE lab_attendance (
        id TEXT PRIMARY KEY,
        labId TEXT NOT NULL,
        studentName TEXT NOT NULL,
        studentId TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (labId) REFERENCES labs (id)
    )`);

    // Class attendance table
    db.run(`CREATE TABLE class_attendance (
        id TEXT PRIMARY KEY,
        classId TEXT NOT NULL,
        studentName TEXT NOT NULL,
        studentId TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late')),
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classId) REFERENCES classes (id)
    )`);

    console.log('Database recreated with updated schema!');
    console.log('Tables created: labs, classes, lab_attendance, class_attendance');
});

db.close();
