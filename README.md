# 电商秒杀系统

## 系统介绍

这是一个基于Spring Boot + Redis + MySQL的电商秒杀系统，实现了核心的秒杀功能和Redis缓存应用。

## 技术栈

- **后端框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **缓存**: Redis 7.0
- **ORM框架**: MyBatis Plus 3.5.4
- **API文档**: SpringDoc OpenAPI 2.2.0
- **工具库**: Hutool 5.8.22, FastJSON2 2.0.41

## 功能特性

### 核心功能
- ✅ 用户注册登录
- ✅ 商品管理
- ✅ 秒杀商品管理
- ✅ 秒杀功能（Redis原子操作）
- ✅ 防重复购买机制
- ✅ 库存预热机制

### 技术特性
- ✅ Redis分布式缓存
- ✅ 原子性库存扣减
- ✅ 用户购买记录缓存
- ✅ RESTful API设计
- ✅ Swagger接口文档

## 快速开始

### 环境要求
- JDK 25
- Maven 3.9+
- MySQL 8.0+
- Redis 7.0+

### 1. 数据库初始化
```bash
# 创建数据库
mysql -u root -p123456 < src/main/resources/sql/init.sql
```

### 2. Redis配置
确保Redis服务运行在localhost:6379，无需密码。

### 3. 启动应用
```bash
# 编译项目
mvn clean compile

# 启动应用
mvn spring-boot:run
```

### 4. 访问应用
- 应用地址: http://localhost:8080
- API文档: http://localhost:8080/swagger-ui.html

## API接口

### 用户管理
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/{id}` - 获取用户信息

### 商品管理
- `GET /api/products` - 获取所有商品
- `GET /api/products/{id}` - 获取商品详情
- `POST /api/products` - 添加商品
- `PUT /api/products/{id}` - 更新商品
- `DELETE /api/products/{id}` - 删除商品

### 秒杀管理
- `GET /api/seckill/list` - 获取秒杀商品列表
- `GET /api/seckill/product/{id}` - 获取秒杀商品详情
- `POST /api/seckill/do` - 执行秒杀
- `POST /api/seckill/add` - 添加秒杀商品
- `POST /api/seckill/preload/{id}` - 预热秒杀库存

## 测试数据

系统已预置测试数据：

### 用户账户
- 用户名: admin/user1/user2/user3
- 密码: hello

### 商品数据
- iPhone 15 Pro: ¥7999 (秒杀价: ¥6999)
- MacBook Pro: ¥14999 (秒杀价: ¥12999)
- iPad Air: ¥4599 (秒杀价: ¥3999)
- AirPods Pro: ¥1899 (秒杀价: ¥1599)
- Apple Watch: ¥2999 (秒杀价: ¥2499)

## 秒杀流程

1. 用户注册/登录
2. 浏览秒杀商品列表
3. 执行秒杀操作
4. 系统原子扣减Redis库存
5. 创建订单记录
6. 标记用户已购买状态

## Redis缓存设计

### 缓存键设计
- `product:{id}` - 商品信息缓存
- `seckill:stock:{id}` - 秒杀库存缓存
- `user:{userId}:seckill:{seckillId}` - 用户购买记录

### 缓存策略
- 商品信息缓存30分钟
- 秒杀库存随活动时间过期
- 用户购买记录随活动时间过期

## 项目结构

```
src/main/java/com/example/
├── entity/          # 实体类
├── mapper/          # 数据访问层
├── service/         # 业务逻辑层
├── controller/      # 控制器层
├── config/          # 配置类
└── common/          # 公共类

src/main/resources/
├── sql/             # 数据库脚本
└── application.yml  # 配置文件
```

## 注意事项

1. 确保MySQL和Redis服务正常运行
2. 首次启动需要执行数据库初始化脚本
3. 秒杀商品会根据当前时间设置不同的活动状态
4. 同一用户不能重复购买同一秒杀商品
5. 库存扣减使用Redis原子操作，保证并发安全

## 开发说明

本项目适合作为课程设计使用，重点展示了：
- Spring Boot项目结构
- Redis在电商场景的应用
- 分布式缓存的使用
- 高并发秒杀的核心逻辑
- RESTful API设计规范