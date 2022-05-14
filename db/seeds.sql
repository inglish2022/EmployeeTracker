INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Management'),
('Legal'),
('Accounting'),
('Quality');

INSERT INTO role (title, salary, department_id) 
    -> VALUES
    -> ('Accountant', 30000, 3),
    -> ('Quality Tech', 15000, 2),
    -> ('Project Manager', 60000, 5),
    -> ('Sales Rep', 50000, 7),
    -> ('Marketing Coordinator', 80000, 6),
    -> ('Account Executive', 70000, 1);