-- 创建数据库
CREATE DATABASE IF NOT EXISTS revenue_monitor DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE revenue_monitor;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    lastLoginAt DATETIME,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- 持仓表
CREATE TABLE IF NOT EXISTS holdings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('stock', 'fund') DEFAULT 'stock',
    quantity DECIMAL(20, 4) NOT NULL,
    costPrice DECIMAL(10, 4) NOT NULL,
    currentPrice DECIMAL(10, 4),
    marketValue DECIMAL(20, 2),
    profit DECIMAL(20, 2),
    profitRate DECIMAL(10, 4),
    `group` VARCHAR(50),
    note TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userId (userId),
    INDEX idx_code (code),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 股票数据表
CREATE TABLE IF NOT EXISTS stock_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    date DATE NOT NULL,
    `open` DECIMAL(10, 4),
    high DECIMAL(10, 4),
    low DECIMAL(10, 4),
    `close` DECIMAL(10, 4),
    volume BIGINT,
    amount DECIMAL(20, 2),
    changePercent DECIMAL(10, 4),
    changeAmount DECIMAL(10, 4),
    turnoverRate DECIMAL(10, 4),
    pe DECIMAL(10, 4),
    pb DECIMAL(10, 4),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_code_date (code, date),
    INDEX idx_code (code),
    INDEX idx_date (date)
);

-- 收益分析表
CREATE TABLE IF NOT EXISTS revenue_analysis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    holdingId INT NOT NULL,
    date DATE NOT NULL,
    dailyReturn DECIMAL(10, 6),
    cumulativeReturn DECIMAL(10, 4),
    maxDrawdown DECIMAL(10, 4),
    volatility DECIMAL(10, 4),
    sharpeRatio DECIMAL(10, 4),
    totalValue DECIMAL(20, 2),
    totalProfit DECIMAL(20, 2),
    totalCost DECIMAL(20, 2),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userId_date (userId, date),
    INDEX idx_holdingId (holdingId),
    INDEX idx_date (date),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (holdingId) REFERENCES holdings(id) ON DELETE CASCADE
);

-- 用户配置表
CREATE TABLE IF NOT EXISTS user_configs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    `key` VARCHAR(50) NOT NULL,
    value TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_userId_key (userId, `key`),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 插入默认管理员用户（密码: admin123）
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE username = username;