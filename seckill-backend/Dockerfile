# 使用官方OpenJDK 25镜像
FROM openjdk:25-jdk-slim

# 强制取消代理设置，避免构建时网络问题
ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""
ENV NO_PROXY="localhost,127.0.0.1,172.20.0.0/16,172.16.0.0/12,192.168.0.0/16"

# 构建时临时代理参数（进一步确保代理被覆盖）
ARG HTTP_PROXY=""
ARG HTTPS_PROXY=""
ARG NO_PROXY="localhost,127.0.0.1,172.20.0.0/16,172.16.0.0/12,192.168.0.0/16"

# 设置工作目录
WORKDIR /app

# 安装必要的包
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 安装Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# 复制pom.xml和源代码
COPY pom.xml .
COPY src ./src

# 构建应用（代理仅在构建时生效）
RUN mvn clean package -DskipTests

# 暴露端口
EXPOSE 8080

# 设置JVM参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseContainerSupport"

# 确保最终镜像不包含代理配置
ENV HTTP_PROXY="" HTTPS_PROXY="" NO_PROXY=""

# 启动命令
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar target/seckill-1.0-SNAPSHOT.jar"]