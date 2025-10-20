package com.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.concurrent.CompletableFuture;

/**
 * 应用关闭控制器
 * 提供优雅关闭的API端点
 */
@RestController
@RequestMapping("/api")
public class ShutdownController {

    private static final Logger logger = LoggerFactory.getLogger(ShutdownController.class);

    @Autowired
    private ApplicationContext applicationContext;

    /**
     * 优雅关闭应用
     * 注意：这个API在生产环境中应该被保护或禁用
     */
    @PostMapping("/shutdown")
    public String shutdownApplication(HttpServletRequest request,
                                    @RequestHeader(value = "X-Shutdown-Token", required = false) String token) {
        logger.info("收到关闭应用请求，来源IP: {}", request.getRemoteAddr());

        // 简单的安全验证（生产环境中应该使用更安全的认证方式）
        if (!"shutdown-secret-key".equals(token)) {
            logger.warn("无效的关闭令牌，拒绝关闭请求");
            return "关闭失败：无效的令牌";
        }

        // 异步执行关闭操作
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("开始优雅关闭应用...");

                // 等待一小段时间让响应返回
                Thread.sleep(1000);

                // 启动关闭流程
                int exitCode = SpringApplication.exit(applicationContext, () -> 0);

                logger.info("应用关闭完成，退出码: {}", exitCode);
                System.exit(exitCode);

            } catch (Exception e) {
                logger.error("关闭应用时发生错误", e);
                System.exit(1);
            }
        });

        return "应用正在关闭中...";
    }

    /**
     * 获取应用状态
     */
    @PostMapping("/status")
    public String getStatus() {
        return "应用正在运行中，已配置优雅关闭功能";
    }
}