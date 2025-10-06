-- Thêm dữ liệu mẫu cho Room CRUD testing

-- 1. Thêm amenities mẫu
INSERT IGNORE INTO amenities (name, description, icon) VALUES
('WiFi', 'Miễn phí WiFi tốc độ cao', 'wifi'),
('TV', 'TV màn hình phẳng 55 inch', 'tv'),
('Air Conditioning', 'Điều hòa không khí', 'ac'),
('Minibar', 'Tủ lạnh mini', 'minibar'),
('Balcony', 'Ban công riêng', 'balcony'),
('Ocean View', 'View biển', 'ocean'),
('Pet Friendly', 'Cho phép thú cưng', 'pet'),
('Room Service', 'Dịch vụ phòng 24/7', 'service'),
('Safe', 'Két sắt an toàn', 'safe');

-- 2. Cập nhật dữ liệu rooms hiện tại
UPDATE rooms SET 
    price = 500000,
    status = 'AVAILABLE',
    capacity = 1,
    description = 'Phòng đơn tiện nghi cơ bản'
WHERE room_id = 1;

UPDATE rooms SET 
    price = 800000,
    status = 'AVAILABLE',
    capacity = 2,
    description = 'Phòng đôi tiện nghi cao cấp'
WHERE room_id = 2;

UPDATE rooms SET 
    price = 1200000,
    status = 'AVAILABLE',
    capacity = 4,
    description = 'Phòng suite sang trọng'
WHERE room_id = 3;

-- 3. Thêm room details cho phòng 1
INSERT IGNORE INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(1, 'Single Bed', 25.0, 1, 'City View', FALSE, FALSE, '100Mbps', TRUE, FALSE, FALSE, FALSE);

-- 4. Thêm room details cho phòng 2
INSERT IGNORE INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(2, 'Double Bed', 35.0, 2, 'Garden View', FALSE, TRUE, '200Mbps', TRUE, TRUE, TRUE, FALSE);

-- 5. Thêm room details cho phòng 3
INSERT IGNORE INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(3, 'King Bed', 50.0, 3, 'Ocean View', FALSE, TRUE, '500Mbps', TRUE, TRUE, TRUE, TRUE);

-- 6. Thêm amenities cho phòng 1
INSERT IGNORE INTO room_amenities (room_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 9);

-- 7. Thêm amenities cho phòng 2
INSERT IGNORE INTO room_amenities (room_id, amenity_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 7), (2, 9);

-- 8. Thêm amenities cho phòng 3
INSERT IGNORE INTO room_amenities (room_id, amenity_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 9), (3, 10);

-- 9. Thêm images cho phòng 1
INSERT IGNORE INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(1, 'https://example.com/room1-1.jpg', 'Phòng đơn 101', TRUE, 0),
(1, 'https://example.com/room1-2.jpg', 'Bathroom phòng 101', FALSE, 1);

-- 10. Thêm images cho phòng 2
INSERT IGNORE INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(2, 'https://example.com/room2-1.jpg', 'Phòng đôi 102', TRUE, 0),
(2, 'https://example.com/room2-2.jpg', 'View từ phòng 102', FALSE, 1);

-- 11. Thêm images cho phòng 3
INSERT IGNORE INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(3, 'https://example.com/room3-1.jpg', 'Phòng suite 201', TRUE, 0),
(3, 'https://example.com/room3-2.jpg', 'Living area phòng 201', FALSE, 1);
