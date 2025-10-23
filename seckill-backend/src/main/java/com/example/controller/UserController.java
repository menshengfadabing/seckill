package com.example.controller;

import com.example.common.Result;
import com.example.dto.UserLoginRequest;
import com.example.dto.UserRegisterRequest;
import com.example.entity.User;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "新用户注册")
    public Result<String> register(
            @Parameter(description = "注册参数", required = true)
            @Valid @RequestBody UserRegisterRequest request) {
        boolean success = userService.register(request.getUsername(), request.getPassword());
        return Result.success("注册成功");
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户登录验证")
    public Result<Map<String, Object>> login(
            @Parameter(description = "登录参数", required = true)
            @Valid @RequestBody UserLoginRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());
        if (user != null) {
            // 清除密码信息
            user.setPassword(null);

            Map<String, Object> result = new HashMap<>();
            result.put("user", user);
            result.put("token", "mock-token-" + user.getId()); // 简单的模拟token

            return Result.success("登录成功", result);
        } else {
            return Result.error("登录失败，用户名或密码错误");
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取用户信息", description = "根据用户ID获取用户信息")
    public Result<User> getUserById(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            if (user != null) {
                return Result.success("获取用户信息成功", user);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            return Result.error("获取用户信息失败: " + e.getMessage());
        }
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "根据用户名获取用户信息", description = "根据用户名获取用户信息")
    public Result<User> getUserByUsername(
            @Parameter(description = "用户名", required = true)
            @PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            if (user != null) {
                return Result.success("获取用户信息成功", user);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            return Result.error("获取用户信息失败: " + e.getMessage());
        }
    }
}