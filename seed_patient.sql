USE hospital;
INSERT INTO users (name, email, password, role) 
SELECT * FROM (SELECT 'Jane Doe', 'patient@mediqueue.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient') AS tmp
WHERE NOT EXISTS (
    SELECT email FROM users WHERE email = 'patient@mediqueue.com'
) LIMIT 1;

SET @user_id = (SELECT id FROM users WHERE email = 'patient@mediqueue.com');

INSERT INTO patients (user_id, age, gender, phone)
SELECT * FROM (SELECT @user_id, 28, 'female', '1234567890') AS tmp
WHERE NOT EXISTS (
    SELECT user_id FROM patients WHERE user_id = @user_id
) LIMIT 1;
