-- RescueBite MySQL 8.x Database Schema
CREATE DATABASE IF NOT EXISTS rescuebite_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rescuebite_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    role VARCHAR(30) NOT NULL,
    organization_name VARCHAR(150) NOT NULL,
    organization_type VARCHAR(80) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(30) NOT NULL,
    donor_id BIGINT NOT NULL,
    storage_condition VARCHAR(80) NOT NULL,
    dietary_type VARCHAR(40) NOT NULL,
    allergens VARCHAR(255),
    prep_timestamp DATETIME NOT NULL,
    pickup_window_start DATETIME NOT NULL,
    pickup_window_end DATETIME NOT NULL,
    expiry_deadline DATETIME NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'AVAILABLE',
    claimed_by_org_id BIGINT NULL,
    claimed_at DATETIME NULL,
    scheduled_pickup_time DATETIME NULL,
    collected_at DATETIME NULL,
    image_url VARCHAR(500),
    handling_instructions TEXT,
    temperature_at_listing VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES users(id),
    CONSTRAINT fk_donation_recipient FOREIGN KEY (claimed_by_org_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NOT NULL,
    recipient_org_id BIGINT NOT NULL,
    volunteer_name VARCHAR(100),
    volunteer_phone VARCHAR(30),
    beneficiaries_count INT DEFAULT 0,
    scheduled_pickup_time DATETIME NOT NULL,
    status VARCHAR(30) DEFAULT 'RESERVED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_claim_donation FOREIGN KEY (donation_id) REFERENCES donations(id),
    CONSTRAINT fk_claim_recipient FOREIGN KEY (recipient_org_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    donation_id BIGINT NULL,
    action VARCHAR(80) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(30) NOT NULL,
    details TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    org_name VARCHAR(150) NOT NULL,
    org_type VARCHAR(80) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(80) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    daily_capacity INT DEFAULT 100,
    tax_exempt_id VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
