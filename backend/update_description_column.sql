-- Update description column to support longer text
USE hotel_booking;

-- Check current column definition
DESCRIBE rooms;

-- Update description column to TEXT if it's not already
ALTER TABLE rooms MODIFY COLUMN description TEXT;

-- Verify the change
DESCRIBE rooms;
