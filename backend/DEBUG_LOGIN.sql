-- ================================================
-- Script debug để kiểm tra user và role
-- ================================================

-- 1. Kiểm tra user có tồn tại không
SELECT user_id, name, email, enabled, email_verified 
FROM users 
WHERE email = 'test@hotelhub.com';

-- 2. Kiểm tra role của user
SELECT u.name, u.email, r.name as role_name
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.email = 'test@hotelhub.com';

-- 3. Kiểm tra tất cả users
SELECT user_id, name, email, enabled 
FROM users 
ORDER BY user_id;

-- 4. Kiểm tra tất cả roles
SELECT role_id, name, description 
FROM roles;

-- 5. Kiểm tra user_roles mapping
SELECT u.name, u.email, r.name as role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id;
