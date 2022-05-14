//required express
const express = require('express');
//import inquirer
const inquirer = require('inquirer');
//import mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());





// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'Reagan111501',
        database: 'employee_tracker_db'
    },
    console.log('Connected to the employee_tracker_db database.')
);

db.query(`SELECT * FROM department`, (err, rows) => {
    console.log(rows);
});

// GET a single candidate
db.query(`SELECT * FROM department WHERE id = 1`, (err, row) => {
    if (err) {
        console.log(err);
    }
    console.log(row);
});

// Delete a candidate
// db.query(`DELETE FROM department WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });

// Create a candidate
const sql = `INSERT INTO department (id, name) 
              VALUES (?,?)`;
const params = [1, 'Sales'];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});



app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});














app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});