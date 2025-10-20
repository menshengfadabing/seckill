package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 用户登录请求DTO
 */
@Schema(description = "用户登录请求")
public class UserLoginRequest {

    @Schema(description = "用户名", example = "testuser", required = true)
    private String username;

    @Schema(description = "密码", example = "123456", required = true)
    private String password;

    public UserLoginRequest() {}

    public UserLoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}