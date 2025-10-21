-- 创建数据库
CREATE DATABASE IF NOT EXISTS seckill DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE seckill;

-- 商品表
CREATE TABLE IF NOT EXISTS tb_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL COMMENT '商品名称',
    product_desc TEXT COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    stock_count INT NOT NULL DEFAULT 0 COMMENT '库存数量',
    status TINYINT DEFAULT 1 COMMENT '商品状态 1-正常 0-下架',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 秒杀商品表
CREATE TABLE IF NOT EXISTS tb_seckill_product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL COMMENT '商品ID',
    seckill_price DECIMAL(10,2) NOT NULL COMMENT '秒杀价格',
    stock_count INT NOT NULL COMMENT '秒杀库存',
    start_time DATETIME NOT NULL COMMENT '秒杀开始时间',
    end_time DATETIME NOT NULL COMMENT '秒杀结束时间',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-结束',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀商品表';

-- 用户表
CREATE TABLE IF NOT EXISTS tb_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 秒杀订单表
CREATE TABLE IF NOT EXISTS tb_seckill_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(64) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    product_id BIGINT NOT NULL COMMENT '商品ID',
    seckill_price DECIMAL(10,2) NOT NULL COMMENT '秒杀价格',
    status TINYINT DEFAULT 0 COMMENT '订单状态 0-成功 1-失败',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='秒杀订单表';

-- 清空现有数据
DELETE FROM tb_seckill_order;
DELETE FROM tb_seckill_product;
DELETE FROM tb_product;
DELETE FROM tb_user;

-- 插入测试用户
INSERT INTO tb_user (username, password) VALUES
('admin', '5d41402abc4b2a76b9719d911017c592'), -- password: hello
('user1', '5d41402abc4b2a76b9719d911017c592'),
('user2', '5d41402abc4b2a76b9719d911017c592'),
('user3', '5d41402abc4b2a76b9719d911017c592');

-- 插入测试商品
INSERT INTO tb_product (product_name, product_desc, price, stock_count, status) VALUES
('iPhone 15 Pro', 'Apple iPhone 15 Pro 256GB', 7999.00, 100, 1),
('MacBook Pro', 'Apple MacBook Pro 14 inch', 14999.00, 50, 1),
('iPad Air', 'Apple iPad Air 11 inch', 4599.00, 200, 1),
('AirPods Pro', 'Apple AirPods Pro 2nd gen', 1899.00, 500, 1),
('Apple Watch', 'Apple Watch Series 9', 2999.00, 300, 1);

-- 插入秒杀商品
INSERT INTO tb_seckill_product (product_id, seckill_price, stock_count, start_time, end_time, status) VALUES
(1, 6999.00, 10, DATE_ADD(NOW(), INTERVAL -1 HOUR), DATE_ADD(NOW(), INTERVAL 2 HOUR), 1), -- iPhone 15 Pro 秒杀
(2, 12999.00, 5, DATE_ADD(NOW(), INTERVAL 30 MINUTE), DATE_ADD(NOW(), INTERVAL 3 HOUR), 1), -- MacBook Pro 秒杀
(3, 3999.00, 20, DATE_ADD(NOW(), INTERVAL -30 MINUTE), DATE_ADD(NOW(), INTERVAL 1 HOUR), 1), -- iPad Air 秒杀
(4, 1599.00, 50, DATE_ADD(NOW(), INTERVAL 15 MINUTE), DATE_ADD(NOW(), INTERVAL 4 HOUR), 1), -- AirPods Pro 秒杀
(5, 2499.00, 30, DATE_ADD(NOW(), INTERVAL 45 MINUTE), DATE_ADD(NOW(), INTERVAL 5 HOUR), 1); -- Apple Watch 秒杀

-- 查看插入的数据
SELECT '用户数据:' as info;
SELECT * FROM tb_user;

SELECT '商品数据:' as info;
SELECT * FROM tb_product;

SELECT '秒杀商品数据:' as info;
SELECT * FROM tb_seckill_product;

-- 设置当前时间
SET @current_time = NOW();

-- 显示当前时间和秒杀活动状态
SELECT
    @current_time as current_time,
    id,
    product_id,
    seckill_price,
    stock_count,
    start_time,
    end_time,
    CASE
        WHEN start_time > @current_time THEN '未开始'
        WHEN end_time < @current_time THEN '已结束'
        ELSE '进行中'
    END as activity_status
FROM tb_seckill_product
ORDER BY start_time;