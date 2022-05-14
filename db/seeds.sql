INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Management'),
('Legal'),
('Accounting'),
('Quality');

INSERT INTO role (title, salary, department_id) 
 VALUES
 ('Accountant', 30000, 3),
 ('Quality Tech', 15000, 2),
 ('Project Manager', 60000, 5),
 ('Sales Rep', 50000, 4),
 ('Marketing Coordinator', 80000, 3),
 ('Account Executive', 70000, 1);

 INSERT INTO employee (first_name, last_name, role_id, manager_id)
 VALUES
 ('Reagan', 'Foust', 1, 1),
 ('Logan', 'Foust', 4, null),
 ('Kooper', 'Foust', 2, null),
 ('Destiny', 'Moore', 3, 3),
 ('Tom', 'Simmons', 5, null),
 ('Mike', 'Webster', 4, 1),
 ('Jessica', 'Cooper', 5, 5),
 ('Naomi', 'Smith', 4, null);