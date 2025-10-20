package com.example.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 秒杀请求DTO
 */
@Schema(description = "秒杀请求")
public class SeckillRequest {

    @Schema(description = "用户ID", example = "1", required = true)
    private Long userId;

    @Schema(description = "秒杀商品ID", example = "1", required = true)
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