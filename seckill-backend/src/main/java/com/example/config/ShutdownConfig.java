package com.example.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import jakarta.annotation.PreDestroy;
import java.net.ServerSocket;
import java.util.concurrent.Executor;

/**
 * 应用关闭配置类
 * 配置优雅关闭和端口自动释放
 */
@Configuration
public class ShutdownConfig {

    private static final Logger logger = LoggerFactory.getLogger(ShutdownConfig.class);
    private ServerSocket reserveSocket;

    /**
     * 应用关闭事件监听器
     */
    @Bean
    public ApplicationListener<ContextClosedEvent> contextClosedEventListener() {
        return event -> {
            logger.info("应用正在关闭，开始执行清理操作...");

            // 执行清理操作
            performCleanup();

            logger.info("应用关闭操作完成");
        };
    }

    /**
     * 自定义任务执行器，用于优雅关闭
     */
    @Bean(name = "shutdownTaskExecutor")
    public TaskExecutor shutdownTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("shutdown-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }

    /**
     * 预销毁方法，在应用关闭前调用
     */
    @PreDestroy
    public void preDestroy() {
        logger.info("执行预销毁操作，准备关闭应用...");
        performCleanup();
    }

    /**
     * 执行清理操作
     */
    private void performCleanup() {
        try {
            // 关闭保留的socket
            if (reserveSocket != null && !reserveSocket.isClosed()) {
                reserveSocket.close();
                logger.info("关闭保留的Socket");
            }

            // 强制垃圾回收
            System.gc();
            logger.info("执行垃圾回收");

            // 等待一小段时间确保清理完成
            Thread.sleep(1000);

        } catch (Exception e) {
            logger.error("执行清理操作时发生错误", e);
        }
    }
}