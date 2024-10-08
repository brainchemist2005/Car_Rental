const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize the SQLite database
const db = new sqlite3.Database('./companies.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyName TEXT,
            phone TEXT,
            address TEXT,
            website TEXT,
            email TEXT,
            password TEXT,
            longitude TEXT,
            latitude TEXT
        )`, (err) => {
            if (err) {
                console.log('Table already exists.');
            }
        });
    }
});

// Route to handle form submission
app.post('/afterSignUp.html', (req, res) => {
    const { companyName, phone, address, website, email, password, longitude, latitude } = req.body;

    if (!companyName || !phone || !address || !website || !email || !password || !longitude || !latitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = `INSERT INTO companies (companyName, phone, address, website, email, password, longitude, latitude)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [companyName, phone, address, website, email, password, longitude, latitude], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error inserting company into the database.' });
        }
        res.json({ message: 'Company registered successfully!' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
