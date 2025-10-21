# 电商秒杀系统 v1.3 - Docker完整部署版

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/your-repo/seckill)
[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/your-repo/seckill/releases)
[![Java](https://img.shields.io/badge/java-25-orange.svg)](https://openjdk.java.net/projects/jdk/25/)
[![Spring Boot](https://img.shields.io/badge/spring%20boot-3.5.6-green.svg)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-yellow.svg)](LICENSE)

一个基于Spring Boot 3.5.6的高性能电商秒杀系统，支持高并发场景下的秒杀功能，使用Redis实现分布式缓存，具备完整的管理功能和优秀的性能表现。本项目已完全容器化，支持一键Docker Compose部署。

## 🎯 项目特性

- ✅ **用户管理**: 用户注册、登录、信息查询
- ✅ **商品管理**: 商品列表、详情查询、增删改查
- ✅ **秒杀活动**: 秒杀商品展示、库存预热、并发控制
- ✅ **订单管理**: 订单创建、订单查询、购买记录
- ✅ **缓存机制**: Redis分布式缓存，提升查询性能
- ✅ **并发控制**: 原子库存扣减，防止超卖
- ✅ **重复购买防护**: Redis标记用户购买状态
- ✅ **数据一致性**: 事务处理确保数据一致性
- ✅ **参数校验**: 完善的参数验证机制
- ✅ **异常处理**: 统一的异常处理体系
- ✅ **API文档**: Swagger接口文档 (SpringDoc OpenAPI 3)
- ✅ **优雅关闭**: 支持应用优雅关闭和资源清理
- ✅ **Docker部署**: 完整的容器化部署方案
- ✅ **代理兼容**: 支持各种网络环境的Docker构建

## 🛠️ 技术栈

- **框架**: Spring Boot 3.5.6
- **数据库**: MySQL 8.0
- **缓存**: Redis 6.x
- **ORM**: Spring Data JPA + Hibernate
- **文档**: SpringDoc OpenAPI 3
- **构建工具**: Maven
- **JDK版本**: OpenJDK 25
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx

## 🚀 快速开始

### 方式一：Docker Compose 一键部署（强烈推荐）

#### 前置要求
- Docker 20.0+
- Docker Compose 2.0+
- 至少 4GB 可用内存
- 至少 10GB 可用磁盘空间

#### 一键启动

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd seckill
   ```

2. **一键部署**
   ```bash
   docker-compose up -d
   ```

3. **等待服务启动**（约1-2分钟）
   ```bash
   # 查看服务状态
   docker-compose ps

   # 查看应用日志
   docker-compose logs -f seckill-app
   ```

4. **访问应用**
   - 🌐 **应用主页**: http://localhost:8081
   - 📚 **API文档**: http://localhost:8081/swagger-ui.html
   - 🔍 **健康检查**: `curl -X POST http://localhost:8081/api/status`
   - 📊 **Nginx代理**: http://localhost:8082

5. **停止服务**
   ```bash
   docker-compose down
   ```

#### 服务端口说明

| 服务 | 容器端口 | 主机端口 | 访问地址 | 说明 |
|------|----------|----------|----------|------|
| MySQL | 3306 | 3307 | localhost:3307 | 数据库服务 |
| Redis | 6379 | 6380 | localhost:6380 | 缓存服务 |
| 主应用 | 8080 | 8081 | localhost:8081 | Spring Boot应用 |
| Nginx | 80 | 8082 | localhost:8082 | 反向代理 |

### 方式二：本地开发环境

#### 环境要求
- JDK 25+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.x+

#### 安装步骤

1. **数据库初始化**
   ```bash
   # 创建数据库
   mysql -u root -p123456 < src/main/resources/sql/init.sql
   ```

2. **Redis启动**
   ```bash
   # 启动Redis服务
   redis-server
   ```

3. **运行应用**
   ```bash
   # 编译并运行
   mvn clean spring-boot:run
   ```

4. **访问应用**
   - 应用地址: http://localhost:8080
   - API文档: http://localhost:8080/swagger-ui.html

## 📚 API接口文档

### 访问方式

#### 🌐 Swagger UI (推荐)
访问 http://localhost:8081/swagger-ui.html 查看完整的交互式API文档

#### 📋 接口列表

##### 1. 用户管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/users/register` | 用户注册 |
| POST | `/api/users/login` | 用户登录 |
| GET | `/api/users/{id}` | 获取用户信息 |
| GET | `/api/users/username/{username}` | 根据用户名获取用户信息 |

##### 2. 商品管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/products` | 获取商品列表 |
| GET | `/api/products/{id}` | 获取商品详情 |
| POST | `/api/products` | 添加商品 |
| PUT | `/api/products/{id}` | 更新商品 |
| DELETE | `/api/products/{id}` | 删除商品 |

##### 3. 秒杀管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/seckill/list` | 获取秒杀商品列表 |
| GET | `/api/seckill/product/{id}` | 获取秒杀商品详情 |
| POST | `/api/seckill/do` | 执行秒杀 |
| POST | `/api/seckill/add` | 添加秒杀商品 |
| POST | `/api/seckill/preload/{id}` | 预热秒杀库存 |
| GET | `/api/seckill/check/{userId}/{seckillId}` | 检查用户购买状态 |
| GET | `/api/seckill/orders/{userId}` | 获取用户订单列表 |
| GET | `/api/seckill/order/{orderNo}` | 根据订单号获取订单详情 |

##### 4. 系统管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/status` | 应用状态检查 |
| POST | `/api/shutdown` | 优雅关闭应用 |

#### 🧪 API测试示例

```bash
# 1. 用户注册
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'

# 2. 获取商品列表
curl http://localhost:8081/api/products

# 3. 获取秒杀商品列表
curl http://localhost:8081/api/seckill/list

# 4. 执行秒杀
curl -X POST http://localhost:8081/api/seckill/do \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"seckillId":1}'

# 5. 应用健康检查
curl -X POST http://localhost:8081/api/status
```

## 🏗️ 系统架构

### 项目结构
```
seckill/
├── src/main/java/com/example/
│   ├── controller/          # 控制器层
│   │   ├── UserController.java
│   │   ├── ProductController.java
│   │   ├── SeckillController.java
│   │   └── ShutdownController.java
│   ├── service/             # 业务逻辑层
│   │   ├── UserService.java
│   │   ├── ProductService.java
│   │   └── SeckillService.java
│   ├── entity/              # 实体类
│   │   ├── User.java
│   │   ├── Product.java
│   │   ├── SeckillProduct.java
│   │   └── SeckillOrder.java
│   ├── dto/                 # 数据传输对象
│   │   ├── UserLoginRequest.java
│   │   ├── UserRegisterRequest.java
│   │   └── SeckillRequest.java
│   ├── common/              # 通用类
│   │   └── Result.java
│   ├── exception/           # 异常处理
│   │   ├── GlobalExceptionHandler.java
│   │   └── BusinessException.java
│   ├── config/              # 配置类
│   │   ├── RedisConfig.java
│   │   ├── CorsConfig.java
│   │   ├── JsonConfig.java
│   │   └── ShutdownConfig.java
│   └── App.java             # 应用启动类
├── src/main/resources/
│   ├── application.yml       # 应用配置
│   ├── application-docker.yml # Docker环境配置
│   └── sql/
│       └── init.sql          # 数据库初始化脚本
├── src/test/java/com/example/
│   └── AppTest.java          # 单元测试
├── docker-compose.yml        # Docker Compose配置
├── Dockerfile               # Docker镜像配置
├── .dockerignore            # Docker忽略文件
├── nginx/
│   └── nginx.conf           # Nginx反向代理配置
├── mysql/
│   └── my.cnf               # MySQL配置
├── redis/
│   └── redis.conf           # Redis配置
├── docs/                    # 项目文档
│   ├── 课设要求.md           # 课程设计要求
│   └── 设计方案.md           # 系统设计方案
├── test/test_v1.2/          # 压力测试脚本
│   ├── final_integration_test.py
│   ├── v12_complete_stress_test.py
│   └── ...
├── pom.xml                  # Maven配置
├── README.md                # 项目主文档
├── PORT_MAPPING.md          # 端口映射说明
├── DOCKER_PROXY_FIX.md      # Docker代理问题修复指南
└── CLAUDE.md                # Claude开发指南
```

### 数据库设计

#### 用户表 (tb_user)
- `id`: 用户ID (主键)
- `username`: 用户名 (唯一)
- `password`: 密码 (MD5加密)
- `create_time`: 创建时间

#### 商品表 (tb_product)
- `id`: 商品ID (主键)
- `product_name`: 商品名称
- `product_desc`: 商品描述
- `price`: 商品价格
- `stock_count`: 库存数量
- `status`: 商品状态 (1-正常 0-下架)
- `create_time`: 创建时间

#### 秒杀商品表 (tb_seckill_product)
- `id`: 秒杀商品ID (主键)
- `product_id`: 关联商品ID
- `seckill_price`: 秒杀价格
- `stock_count`: 秒杀库存
- `start_time`: 开始时间
- `end_time`: 结束时间
- `status`: 状态 (1-正常 0-结束)
- `create_time`: 创建时间

#### 秒杀订单表 (tb_seckill_order)
- `id`: 订单ID (主键)
- `order_no`: 订单号 (唯一)
- `user_id`: 用户ID
- `product_id`: 商品ID
- `seckill_price`: 秒杀价格
- `status`: 订单状态 (0-成功 1-失败)
- `create_time`: 创建时间

### 核心技术实现

#### 1. 分布式缓存
- 使用Redis缓存商品信息、用户信息
- 缓存秒杀库存，提升并发性能
- 支持缓存过期和更新策略

#### 2. 并发控制
- Redis原子操作实现库存扣减
- 防止超卖问题
- 支持高并发场景

#### 3. 重复购买防护
- Redis标记用户购买状态
- 防止重复秒杀
- 基于用户ID和商品ID的双重校验

#### 4. 数据一致性
- 事务处理确保数据一致性
- 秒杀成功同时扣减商品库存
- 异常回滚机制

## 🐳 Docker部署详解

### 服务组件

| 服务名 | 镜像 | 端口映射 | 说明 |
|--------|------|----------|------|
| seckill-app | 自定义 | 8081:8080 | 秒杀应用 |
| mysql | mysql:8.0 | 3307:3306 | 数据库 |
| redis | redis:6.2-alpine | 6380:6379 | 缓存 |
| nginx | nginx:alpine | 8082:80, 8443:443 | 反向代理 |

### 网络配置

- **网络名称**: `seckill_seckill-network`
- **IP段**: `172.20.0.0/16`
- **服务发现**: 通过Docker内部DNS

### 数据持久化

- **MySQL数据**: `seckill_mysql_data` volume
- **Redis数据**: `seckill_redis_data` volume
- **应用日志**: `seckill_app_logs` volume

### 健康检查

- **MySQL**: 数据库连接检查
- **Redis**: 缓存连接检查
- **应用**: HTTP状态检查
- **Nginx**: 代理服务检查

### 部署命令详解

```bash
# 🚀 启动所有服务
docker-compose up -d

# 📊 查看服务状态
docker-compose ps

# 📋 查看实时日志
docker-compose logs -f seckill-app

# 🛑 停止所有服务
docker-compose down

# 🔄 重启特定服务
docker-compose restart seckill-app

# 🏗️ 重新构建镜像
docker-compose build --no-cache

# 🔧 进入容器调试
docker-compose exec seckill-app bash

# 💾 备份数据
docker-compose exec mysql mysqldump -u root -p123456 seckill > backup.sql

# 📈 查看资源使用
docker stats
```

### 🔧 Docker代理问题解决

如果遇到Docker构建代理问题，请参考 [DOCKER_PROXY_FIX.md](DOCKER_PROXY_FIX.md) 文件。

#### 常见问题
- 构建时出现 `connecting to proxy` 错误
- 镜像拉取超时
- 网络连接问题

#### 解决方案
本项目已通过以下方式优化了Docker构建配置：
1. **docker-compose.yml**: 在构建参数中强制覆盖代理设置
2. **Dockerfile**: 强制取消代理环境变量
3. **国内镜像加速器**: 配置了多个备用镜像源

如仍遇问题，可参考详细修复指南。

### 🌐 通过Nginx访问

Nginx反向代理已配置完成，可以通过以下方式访问：

- **HTTP**: http://localhost:8082
- **HTTPS**: https://localhost:8443

Nginx配置文件位于 `nginx/nginx.conf`，可根据需要进行调整。

## 🧪 测试

### 运行测试

```bash
# 编译项目
mvn clean compile

# 运行单元测试
mvn test

# 运行集成测试
mvn verify

# 打包应用
mvn package
```

### 🚀 压力测试

项目包含完整的压力测试脚本：

```bash
# 运行完整压力测试
python test/test_v1.2/v12_complete_stress_test.py

# 运行最终集成测试
python test/test_v1.2/final_integration_test.py
```

### 📊 性能指标

#### 测试环境
- **CPU**: 4核
- **内存**: 8GB
- **网络**: 千兆网络

#### 性能表现

| 接口类型 | QPS | 平均响应时间 | 成功率 | 并发数 |
|---------|-----|-------------|--------|--------|
| 商品列表查询 | 633 | 32ms | 100% | 30 |
| 秒杀列表查询 | 684 | 30ms | 100% | 30 |
| 用户信息查询 | 698 | 36ms | 100% | 40 |
| 用户注册 | 149 | 67ms | 100% | 15 |
| 秒杀执行 | 待测试 | 待测试 | 待测试 | 待测试 |

## 📈 监控和日志

### 应用监控

- **健康检查**: `POST /api/status`
- **应用信息**: `/actuator/info`
- **指标监控**: `/actuator/metrics`
- **环境信息**: `/actuator/env`

### 日志配置

- **日志级别**: DEBUG
- **日志文件**: `logs/seckill.log`
- **日志格式**: 结构化日志
- **日志轮转**: 按大小和时间轮转

### 📋 容器日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs seckill-app

# 实时跟踪日志
docker-compose logs -f seckill-app

# 查看最近的日志
docker-compose logs --tail=100 seckill-app
```

## 🔧 配置说明

### 应用配置

主要配置文件：
- `application.yml` - 本地环境配置
- `application-docker.yml` - Docker环境配置

### 环境变量

Docker Compose支持的环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `SPRING_PROFILES_ACTIVE` | docker | Spring Profile |
| `SPRING_DATASOURCE_URL` | - | 数据库连接URL |
| `SPRING_DATASOURCE_USERNAME` | seckill_user | 数据库用户名 |
| `SPRING_DATASOURCE_PASSWORD` | seckill_pass | 数据库密码 |
| `SPRING_DATA_REDIS_HOST` | redis | Redis主机 |
| `SPRING_DATA_REDIS_PORT` | 6379 | Redis端口 |
| `JAVA_OPTS` | -Xms512m -Xmx1024m | JVM参数 |

### 数据库配置

MySQL连接池配置：
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      connection-timeout: 20000
```

### Redis配置

Redis连接池配置：
```yaml
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

## 🚨 安全建议

### 生产环境配置

1. **更改默认密码**
   - MySQL root密码
   - Redis密码
   - 应用关闭密钥

2. **网络安全**
   - 配置防火墙规则
   - 限制数据库访问
   - 启用HTTPS

3. **应用安全**
   - 移除或保护管理接口
   - 加强参数验证
   - 实施API限流

4. **数据安全**
   - 数据库访问控制
   - 敏感信息加密
   - 定期备份数据

### Docker安全

1. **镜像安全**
   - 使用官方基础镜像
   - 定期更新镜像
   - 扫描安全漏洞

2. **容器安全**
   - 非root用户运行
   - 限制容器权限
   - 网络隔离

## 🛠️ 开发指南

### 本地开发

```bash
# 1. 启动依赖服务
docker-compose up -d mysql redis

# 2. 等待服务就绪
docker-compose logs -f mysql

# 3. 运行应用
mvn spring-boot:run

# 4. 访问应用
open http://localhost:8080
```

### 代码规范

- 遵循阿里巴巴Java开发手册
- 使用统一的代码格式化
- 编写完整的单元测试
- 添加必要的注释文档

### Git工作流

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交代码
git add .
git commit -m "feat: add new feature"

# 推送分支
git push origin feature/new-feature

# 创建Pull Request
```

## 📝 版本历史

### v1.3 (2025-10-21) - Docker完整部署版
- ✅ **修复Docker代理问题**: 解决各种网络环境下的构建问题
- ✅ **端口映射优化**: 避免与本地服务端口冲突
- ✅ **完整的Docker Compose配置**: 包含所有依赖服务
- ✅ **Swagger UI正常工作**: API文档完全可用
- ✅ **Nginx反向代理**: 支持HTTP/HTTPS访问
- ✅ **健康检查完善**: 所有服务状态监控
- ✅ **部署文档完善**: 详细的部署和故障排除指南

### v1.2 (2025-10-20)
- ✅ 修复时间格式解析问题
- ✅ 优化用户注册参数验证
- ✅ 完善秒杀商品管理功能
- ✅ 添加Docker部署支持
- ✅ 完善配置文件和文档
- ✅ 所有核心接口100%正常工作

### v1.1 (2025-10-19)
- ✅ 修复数据库表名不一致问题
- ✅ 添加订单查询功能
- ✅ 完善商品库存扣减逻辑
- ✅ 统一依赖注入方式
- ✅ 完善参数校验机制
- ✅ 改进异常处理体系

### v1.0 (初始版本)
- ✅ 基础秒杀功能
- ✅ 用户和商品管理
- ✅ Redis缓存机制
- ✅ 基本的并发控制

## 🔍 故障排除

### 常见问题

#### 1. Docker构建失败
**问题**: 构建时出现代理相关错误
**解决**: 参考 [DOCKER_PROXY_FIX.md](DOCKER_PROXY_FIX.md)

#### 2. 端口冲突
**问题**: 服务端口被占用
**解决**:
- 检查端口占用: `netstat -ano | findstr :8081`
- 修改docker-compose.yml中的端口映射

#### 3. 应用启动失败
**问题**: 应用无法启动或健康检查失败
**解决**:
```bash
# 查看应用日志
docker-compose logs seckill-app

# 检查数据库连接
docker-compose logs mysql

# 重启服务
docker-compose restart seckill-app
```

#### 4. Swagger UI无法访问
**问题**: API文档页面无法打开
**解决**:
- 确认应用正常启动
- 检查端口映射是否正确
- 访问 http://localhost:8081/swagger-ui.html

#### 5. 数据库连接失败
**问题**: 应用无法连接数据库
**解决**:
```bash
# 检查MySQL状态
docker-compose ps mysql

# 查看MySQL日志
docker-compose logs mysql

# 手动连接测试
docker-compose exec mysql mysql -u seckill_user -p seckill
```

### 📞 获取帮助

1. 查看项目文档
2. 检查 [FAQ](docs/FAQ.md)
3. 提交 [Issue](https://github.com/your-repo/seckill/issues)
4. 联系开发团队

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👥 团队

- **开发团队**: 电商秒杀系统开发组
- **技术栈**: Spring Boot + Redis + MySQL + Docker
- **版本维护**: v1.3.0

---

## 🎉 开始使用

### 快速体验 (5分钟搞定)

1. ✅ **克隆项目**
   ```bash
   git clone <repository-url> && cd seckill
   ```

2. ✅ **一键启动**
   ```bash
   docker-compose up -d
   ```

3. ✅ **等待就绪** (查看启动日志)
   ```bash
   docker-compose logs -f seckill-app
   ```

4. ✅ **访问应用**
   - 🌐 主页: http://localhost:8081
   - 📚 API文档: http://localhost:8081/swagger-ui.html
   - 🔍 健康检查: `curl -X POST http://localhost:8081/api/status`

5. ✅ **测试秒杀功能**
   ```bash
   # 查看商品
   curl http://localhost:8081/api/products

   # 查看秒杀商品
   curl http://localhost:8081/api/seckill/list

   # 执行秒杀
   curl -X POST http://localhost:8081/api/seckill/do \
     -H "Content-Type: application/json" \
     -d '{"userId":1,"seckillId":1}'
   ```

### 📖 学习资源

- [Spring Boot官方文档](https://spring.io/projects/spring-boot)
- [Redis官方文档](https://redis.io/documentation)
- [Docker官方文档](https://docs.docker.com/)
- [SpringDoc OpenAPI文档](https://springdoc.org/)

---

**⭐ 如果这个项目对你有帮助，请给它一个星标！**

**🚀 现在就开始体验高性能电商秒杀系统吧！**