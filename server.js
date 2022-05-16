//required express
const express = require('express');
//import inquirer
const inquirer = require('inquirer');
//import mysql2
const mysql = require('mysql2');
// const PORT = process.env.PORT || 3001;
// const app = express();

const consoleTable = require('console.table');
// const Connection = require('mysql2/typings/mysql/lib/Connection');

// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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
    console.log(' ______________________________________________'),
    console.log('|                                              |'),
    console.log('|  YOU ARE CONNECTED TO THE EMPLOYEE DATABASE  |'),
    console.log('|                                              |'),
    console.log('|______________________________________________|'),

);

 afterConnection = () =>  {
    promptUser();
};



const promptUser = () => {
    inquirer.prompt([
        {
            
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
        connection.query(sql, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + " to department selection!");

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
        .then(answer => {
            const params = [answer.role, answer.salary];

            // get dept from department table
            const roleSql = `SELECT name, id FROM department`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const department = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department',
                        message: "What department is this role in?",
                        choices: department
                    }
                ])
                    .then(departmentChoice => {
                        const department = departmentChoice.department;
                        params.push(department);

                        const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Added' + answer.role + " to roles!");

                            showRoles();
                        });
                    });
            });
        });
};

// function to add an employee 
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]

            // grab roles from roles table
            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.promise().query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        connection.promise().query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                            // console.log(managers);

                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;

                                    connection.query(sql, params, (err, result) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")

                                        showEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// function to update an employee 
updateEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;
                const params = [];
                params.push(employee);

                const roleSql = `SELECT * FROM role`;

                connection.promise().query(roleSql, (err, data) => {
                    if (err) throw err;

                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role);

                            let employee = params[0]
                            params[0] = role
                            params[1] = employee


                            // console.log(params)

                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

// function to update an employee 
updateManager = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = empChoice.name;
                const params = [];
                params.push(employee);

                const managerSql = `SELECT * FROM employee`;

                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            let employee = params[0]
                            params[0] = manager
                            params[1] = employee


                            // console.log(params)

                            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                            connection.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");

                                showEmployees();
                            });
                        });
                });
            });
    });
};

// function to view employee by department
employeeDepartment = () => {
    console.log('Showing employee by departments...\n');
    const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// function to delete department
deleteDepartment = () => {
    const departmentSql = `SELECT * FROM department`;

    connection.promise().query(departmentSql, (err, data) => {
        if (err) throw err;

        const department = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "What department do you want to delete?",
                choices: department
            }
        ])
            .then(departmentChoice => {
                const department = departmentChoice.department;
                const sql = `DELETE FROM department WHERE id = ?`;

                connection.query(sql, department, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    showDepartments();
                });
            });
    });
};

// function to delete role
deleteRole = () => {
    const roleSql = `SELECT * FROM role`;

    connection.promise().query(roleSql, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete?",
                choices: role
            }
        ])
            .then(roleChoice => {
                const role = roleChoice.role;
                const sql = `DELETE FROM role WHERE id = ?`;

                connection.query(sql, role, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully deleted!");

                    showRoles();
                });
            });
    });
};

// function to delete employees
deleteEmployee = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;

    connection.promise().query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to delete?",
                choices: employees
            }
        ])
            .then(employeeChoice => {
                const employee = employeeChoice.name;

                const sql = `DELETE FROM employee WHERE id = ?`;

                connection.query(sql, employee, (err, result) => {
                    if (err) throw err;
                    console.log("Successfully Deleted!");

                    showEmployees();
                });
            });
    });
};

// view department budget 
viewBudget = () => {
    console.log('Showing budget by department...\n');

    const sql = `SELECT department_id AS id, 
                        department.name AS department,
                        SUM(salary) AS budget
                 FROM  role  
                 JOIN department ON role.department_id = department.id GROUP BY  department_id`;

    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};









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














// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });