-- Test Data for Facilities Table
-- Run this in your MySQL database to add sample facilities

USE hotel_management;

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM facilities WHERE facility_id > 0;

-- Insert Sample Facilities
INSERT INTO facilities (name, type, price, capacity, status, description, location) VALUES
('Luxury Spa & Wellness', 'SPA', 1500.00, 20, 'AVAILABLE', 'Relax and rejuvenate with our premium spa services including massage, sauna, and aromatherapy.', 'Ground Floor - West Wing'),
('Fitness Center', 'GYM', 0.00, 40, 'AVAILABLE', '24/7 access to state-of-the-art gym equipment with certified personal trainers available.', 'Basement Level 1'),
('Infinity Pool', 'POOL', 500.00, 30, 'AVAILABLE', 'Olympic-sized infinity pool with stunning city views. Temperature controlled year-round.', 'Rooftop - 15th Floor'),
('Grand Banquet Hall', 'BANQUET', 5000.00, 200, 'AVAILABLE', 'Elegant banquet hall perfect for weddings, corporate events, and celebrations. Complete AV setup included.', 'Ground Floor - East Wing'),
('Executive Meeting Room', 'MEETING_HALL', 2000.00, 50, 'AVAILABLE', 'Professional meeting space with video conferencing, projector, and high-speed WiFi.', '3rd Floor - Business Center'),
('The Royal Dine', 'RESTAURANT', 800.00, 80, 'AVAILABLE', 'Fine dining restaurant serving multi-cuisine delicacies with expert chefs and premium wine selection.', 'Ground Floor - North Wing'),
('Meditation Garden', 'OTHER', 300.00, 15, 'AVAILABLE', 'Peaceful outdoor meditation space surrounded by greenery. Perfect for yoga and mindfulness sessions.', 'Terrace Garden'),
('Game Zone', 'OTHER', 400.00, 25, 'AVAILABLE', 'Entertainment zone with billiards, table tennis, and gaming consoles. Perfect for family fun.', '2nd Floor - Recreation Area');

-- Verify insertion
SELECT facility_id, name, type, price, capacity, status FROM facilities;

-- Sample output should show 8 facilities

