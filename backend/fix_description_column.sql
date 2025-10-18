-- Fix description column length issue
USE hotel_booking;

-- Check current column definition
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hotel_booking' 
AND TABLE_NAME = 'rooms' 
AND COLUMN_NAME = 'description';

-- Update description column to TEXT (unlimited length)
ALTER TABLE rooms MODIFY COLUMN description TEXT;

-- Verify the change
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'hotel_booking' 
AND TABLE_NAME = 'rooms' 
AND COLUMN_NAME = 'description';
