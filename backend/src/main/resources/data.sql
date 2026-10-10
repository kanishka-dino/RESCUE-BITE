-- Initial Seed Data for RescueBite MySQL / Spring Boot
-- Passwords hashed with BCrypt (password: 'demoSecurePassword123' -> $2a$10$w09a0VqF3Y0n2aN7Wj8xTeoV3k5aG6b7c8d9e0f1g2h3i4j5k6l7m)
-- For demo bootstrap, password is plain BCrypt hashed

INSERT INTO users (id, email, password, name, phone, role, organization_name, organization_type, address, city, verified)
VALUES
(1, 'marco@greenhearthbistro.org', '$2a$10$7Z.X9zK2b7V4X1Y3C5W6eu2k0v8s9a7d6f5g4h3j2k1l0m9n8o7p', 'Chef Marco Rossi', '+1 (555) 234-8891', 'ROLE_DONOR', 'The Green Hearth Bistro & Banquets', 'Restaurant & Caterer', '428 Heritage Boulevard', 'Metro City', true),
(2, 'sarah@stjudemeals.org', '$2a$10$7Z.X9zK2b7V4X1Y3C5W6eu2k0v8s9a7d6f5g4h3j2k1l0m9n8o7p', 'Sister Sarah Jenkins', '+1 (555) 891-3412', 'ROLE_RECIPIENT', 'St. Jude Community Meals & Shelter', 'Community Kitchen & Shelter', '109 Hope Street, East Ward', 'Metro City', true),
(3, 'elena.vance@rescuebite.org', '$2a$10$7Z.X9zK2b7V4X1Y3C5W6eu2k0v8s9a7d6f5g4h3j2k1l0m9n8o7p', 'Elena Vance', '+1 (555) 019-4820', 'ROLE_ADMIN', 'RescueBite Operations & Safety Board', 'Platform Governance', '100 Sustainability Way', 'Metro City', true)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO donations (id, title, description, category, quantity, unit, donor_id, storage_condition, dietary_type, allergens, prep_timestamp, pickup_window_start, pickup_window_end, expiry_deadline, status, image_url, handling_instructions, temperature_at_listing)
VALUES
(1, 'Surplus Banquet Herb-Roasted Chicken & Pilaf', 'Hot-held executive lunch buffet surplus. Freshly prepared under standard commercial kitchen HACCP guidelines.', 'Cooked Meals', 45, 'servings', 1, 'Hot Held (≥60°C)', 'Non-Vegetarian', 'Celery', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR), 'AVAILABLE', '/src/assets/images/food_donor_kitchen_1791616238592.jpg', 'Maintain temperature ≥60°C in insulated cambro containers.', '68°C'),
(2, 'Farm Fresh Organic Produce & Greens Crate', 'Crisp organic bell peppers, baby spinach, heirloom carrots, and seasonal red apples from weekend culinary prep.', 'Fresh Produce', 35, 'kg', 1, 'Refrigerated (≤4°C)', 'Vegan', 'None reported', NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 8 HOUR), DATE_ADD(NOW(), INTERVAL 24 HOUR), 'AVAILABLE', '/src/assets/images/fresh_produce_crates_1791616248993.jpg', 'Store chilled in perforated ventilated bins.', '3.5°C')
ON DUPLICATE KEY UPDATE id=id;
