-- MySQL User Setup Script for MindNest
-- Run this as MySQL root user

-- Create database
CREATE DATABASE IF NOT EXISTS mindnest;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';

-- Grant all privileges on mindnest database
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Show user created
SELECT User, Host FROM mysql.user WHERE User = 'Harshkant';



