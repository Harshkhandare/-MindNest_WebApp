-- MySQL Setup Script for MindNest
-- Run this script as MySQL root user

-- Create database
CREATE DATABASE IF NOT EXISTS mindnest;

-- Create user
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';

-- Grant privileges
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SELECT 'Database and user created successfully!' AS Status;
SHOW DATABASES LIKE 'mindnest';
SELECT User, Host FROM mysql.user WHERE User = 'Harshkant';


