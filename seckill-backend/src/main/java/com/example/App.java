package com.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

/**
 * 秒杀系统启动类
 * 配置了优雅关闭和端口自动释放功能
 */
@SpringBootApplication
public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        // 添加关闭钩子
        addShutdownHooks();

        // 启动Spring Boot应用
        SpringApplication app = new SpringApplication(App.class);

        // Spring Boot会自动注册关闭钩子

        // 启动应用
        app.run(args);
    }

    /**
     * 添加JVM关闭钩子
     */
    private static void addShutdownHooks() {
        // JVM关闭钩子
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("JVM关闭钩子被触发，开始清理资源...");
            performJvmCleanup();
            logger.info("JVM资源清理完成");
        }, "jvm-shutdown-hook"));

        // 内存监控钩子
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("执行内存清理...");
            performMemoryCleanup();
        }, "memory-cleanup-hook"));
    }

    /**
     * 执行JVM级别的清理操作
     */
    private static void performJvmCleanup() {
        try {
            // 强制垃圾回收
            System.gc();
            System.runFinalization();

            // 等待垃圾回收完成
            Thread.sleep(1000);

            // 输出内存使用情况
            MemoryMXBean memoryBean = ManagementFactory.getMemoryMXBean();
            MemoryUsage heapUsage = memoryBean.getHeapMemoryUsage();
            logger.info("关闭时堆内存使用: {} MB / {} MB",
                heapUsage.getUsed() / 1024 / 1024,
                heapUsage.getMax() / 1024 / 1024);

        } catch (Exception e) {
            logger.error("执行JVM清理时发生错误", e);
        }
    }

    /**
     * 执行内存清理操作
     */
    private static void performMemoryCleanup() {
        try {
            System.gc();
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("内存清理被中断", e);
        }
    }

    /**
     * 应用启动完成事件监听器
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        Environment env = event.getApplicationContext().getEnvironment();
        String port = env.getProperty("server.port", "8080");
        String contextPath = env.getProperty("server.servlet.context-path", "");

        logger.info("=========================================");
        logger.info("秒杀系统启动成功！");
        logger.info("本地访问地址: http://localhost:{}{}", port, contextPath);
        logger.info("API文档地址: http://localhost:{}{}swagger-ui.html", port, contextPath);
        logger.info("应用已配置优雅关闭和端口自动释放功能");
        logger.info("使用 Ctrl+C 可以优雅关闭应用并自动释放端口");
        logger.info("=========================================");
    }
}
