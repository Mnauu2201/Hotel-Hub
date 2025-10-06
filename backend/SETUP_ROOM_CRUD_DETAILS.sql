-- Script setup Room Details - Chạy từng phần một

-- 1. Thêm room details cho phòng 1
INSERT INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(1, 'Single Bed', 25.0, 1, 'City View', FALSE, FALSE, '100Mbps', TRUE, FALSE, FALSE, FALSE);

-- 2. Thêm room details cho phòng 2
INSERT INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(2, 'Double Bed', 35.0, 2, 'Garden View', FALSE, TRUE, '200Mbps', TRUE, TRUE, TRUE, FALSE);

-- 3. Thêm room details cho phòng 3
INSERT INTO room_details (room_id, bed_type, room_size, floor, view_type, smoking_allowed, pet_friendly, wifi_speed, air_conditioning, minibar, balcony, ocean_view) VALUES
(3, 'King Bed', 50.0, 3, 'Ocean View', FALSE, TRUE, '500Mbps', TRUE, TRUE, TRUE, TRUE);

-- 4. Thêm amenities cho phòng 1
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 9);

-- 5. Thêm amenities cho phòng 2
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 7), (2, 9);

-- 6. Thêm amenities cho phòng 3
INSERT INTO room_amenities (room_id, amenity_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 9), (3, 10);

-- 7. Thêm images cho phòng 1
INSERT INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(1, 'https://example.com/room1-1.jpg', 'Phòng đơn 101', TRUE, 0),
(1, 'https://example.com/room1-2.jpg', 'Bathroom phòng 101', FALSE, 1);

-- 8. Thêm images cho phòng 2
INSERT INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(2, 'https://example.com/room2-1.jpg', 'Phòng đôi 102', TRUE, 0),
(2, 'https://example.com/room2-2.jpg', 'View từ phòng 102', FALSE, 1),
(2, 'https://example.com/room2-3.jpg', 'Bathroom phòng 102', FALSE, 2);

-- 9. Thêm images cho phòng 3
INSERT INTO room_images (room_id, image_url, alt_text, is_primary, display_order) VALUES
(3, 'https://example.com/room3-1.jpg', 'Phòng suite 201', TRUE, 0),
(3, 'https://example.com/room3-2.jpg', 'Living area phòng 201', FALSE, 1),
(3, 'https://example.com/room3-3.jpg', 'Ocean view từ phòng 201', FALSE, 2),
(3, 'https://example.com/room3-4.jpg', 'Bathroom phòng 201', FALSE, 3);

