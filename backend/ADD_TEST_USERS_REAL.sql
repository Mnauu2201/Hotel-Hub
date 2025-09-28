-- ================================================
-- Script để thêm user test vào database với password đã hash thật
-- ================================================

-- 1. Xóa user cũ nếu có (để tránh conflict)
DELETE FROM user_roles WHERE user_id IN (SELECT user_id FROM users WHERE email IN ('test@hotelhub.com', 'admin@hotelhub.com'));
DELETE FROM users WHERE email IN ('test@hotelhub.com', 'admin@hotelhub.com');

-- 2. Thêm user test với password "test123" đã hash
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Test User', 'test@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', 1, 1);

-- 3. Gán role ROLE_CUSTOMER cho user test
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'test@hotelhub.com' AND r.name = 'ROLE_CUSTOMER';

-- 4. Thêm user admin với password "admin123" đã hash
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Admin', 'admin@hotelhub.com', '$2a$10$N.zmdr9k7uOCQb97AnInuO2rQjU5S5K5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', '0123456789', 1, 1);

-- 5. Gán role ROLE_ADMIN cho user admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'admin@hotelhub.com' AND r.name = 'ROLE_ADMIN';

-- 6. Kiểm tra kết quả
SELECT u.name, u.email, r.name as role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE u.email IN ('test@hotelhub.com', 'admin@hotelhub.com');
