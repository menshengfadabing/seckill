package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

/**
 * 秒杀请求DTO
 */
@Schema(description = "秒杀请求")
public class SeckillRequest {

    @Schema(description = "用户ID", example = "1", required = true)
    @NotNull(message = "用户ID不能为空")
    @Positive(message = "用户ID必须为正数")
    private Long userId;

    @Schema(description = "秒杀商品ID", example = "1", required = true)
    @NotNull(message = "秒杀商品ID不能为空")
    @Positive(message = "秒杀商品ID必须为正数")
    private Long seckillId;

    public SeckillRequest() {}

    public SeckillRequest(Long userId, Long seckillId) {
        this.userId = userId;
        this.seckillId = seckillId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(Long seckillId) {
        this.seckillId = seckillId;
    }
}