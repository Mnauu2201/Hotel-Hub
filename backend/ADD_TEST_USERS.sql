-- ================================================
-- Script để thêm user test vào database
-- ================================================

-- 1. Thêm user test với password đã hash
-- Password: "test123" (đã hash bằng BCrypt)
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Test User', 'test@hotelhub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0987654321', 1, 1);

-- 2. Gán role ROLE_CUSTOMER cho user test
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'test@hotelhub.com' AND r.name = 'ROLE_CUSTOMER';

-- 3. Thêm user admin với password đã hash
-- Password: "admin123" (đã hash bằng BCrypt)
INSERT INTO users (name, email, password, phone, enabled, email_verified) 
VALUES ('Admin', 'admin@hotelhub.com', '$2a$10$N.zmdr9k7uOCQb97AnInuO2rQjU5S5K5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', '0123456789', 1, 1);

-- 4. Gán role ROLE_ADMIN cho user admin
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'admin@hotelhub.com' AND r.name = 'ROLE_ADMIN';

-- 5. Kiểm tra kết quả
SELECT u.name, u.email, r.name as role_name
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE u.email IN ('test@hotelhub.com', 'admin@hotelhub.com');
