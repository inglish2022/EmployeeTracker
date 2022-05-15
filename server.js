//required express
const express = require('express');
//import inquirer
const inquirer = require('inquirer');
//import mysql2
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

const consoleTable = require('console.table');
// const Connection = require('mysql2/typings/mysql/lib/Connection');

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


const promptUser = () => {
    inquirer.prompt([
        {
            name: 'action',
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all employees',
                'View all roles',
                'Add a department',
                'Add an employee',
                'Add a role',
                'Update an employee role',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'EXIT'
            ]
        }
    ])

        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View all departments') {
                showDepartments();
            }
            if (choices === 'View all employees') {
                showEmployees();
            }
            if (choices === 'View all roles') {
                showRoles();
            }
            if (choices === 'Add a department') {
                addDepartment();
            }
            if (choices === 'Add an employee') {
                addEmployee();
            }
            if (choices === 'Add a role') {
                addRole();
            }
            if (choices === 'Update an employee role') {
                updateEmployee();
            }
            if (choices === 'Delete a department') {
                deleteDepartment();
            }
            if (choices === 'Delete an employee') {
                deleteEmployee();
            }
            if (choices === 'Delete a role') {
                deleteRole();
            }
            if (choices === 'EXIT') {
                connection.end();
            };

        });
};

//showing all departments
showDepartments = () => {
    console.log('All Deparments .../n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//showing all roles
showRoles = () => {
    console.log('All roles.../n');
    const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//showing all employees
showEmployees = () => {
    console.log('Showing all employees...\n');
    const sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.name AS department,
                        role.salary, 
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager
                 FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//add a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: 'What department would you like to add?',
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter a department name!');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (name)
        VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDept + " to department selection!");

            showDepartments();
        });
    });
};

//add a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addRole',
            message: "What role would you like to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'addSalary',
            message: "What is the salary of this role?",
            validate: addSalary => {
                if (addSalary) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
       

    ])
    .then(answer =>  {

    })
}







// db.query(`SELECT * FROM department`, (err, rows) => {
//     console.log(rows);
// });

// GET a single candidate
// db.query(`SELECT * FROM department WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// Delete a candidate
// db.query(`DELETE FROM department WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });

// Create a candidate
// const sql = `INSERT INTO department (id, name) 
//               VALUES (?,?)`;
// const params = [1, 'Sales'];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Get all departments
// app.get('/api/department', (req, res) => {
//     const sql = `SELECT * FROM department`;

//     db.query(sql, (err, rows) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: rows
//         });
//     });
// });

// // Get a single candidate
// app.get('/api/department/:id', (req, res) => {
//     const sql = `SELECT * FROM department WHERE id = ?`;
//     const params = [req.params.id];

//     db.query(sql, params, (err, row) => {
//         if (err) {
//             res.status(400).json({ error: err.message });
//             return;
//         }
//         res.json({
//             message: 'success',
//             data: row
//         });
//     });
// });

// // Delete a candidate
// app.delete('/api/department/:id', (req, res) => {
//     const sql = `DELETE FROM department WHERE id = ?`;
//     const params = [req.params.id];

//     db.query(sql, params, (err, result) => {
//         if (err) {
//             res.statusMessage(400).json({ error: res.message });
//         } else if (!result.affectedRows) {
//             res.json({
//                 message: 'Department not found'
//             });
//         } else {
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });

// // Create a candidate
// app.post('/api/department', ({ body }, res) => {
//     const errors = inputCheck(body, 'name');
//     if (errors) {
//         res.status(400).json({ error: errors });
//         return;
//     }
// });

// const sql = `INSERT INTO department (name)
//   VALUES (?)`;
// const params = [body.name];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         res.status(400).json({ error: err.message });
//         return;
//     }
//     res.json({
//         message: 'success',
//         data: body
//     });
// });

// Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
// });



// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });














app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});