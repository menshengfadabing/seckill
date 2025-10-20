package com.example.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 秒杀商品实体类
 */
@Entity
@Table(name = "tb_seckill_product")
public class SeckillProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private BigDecimal seckillPrice;

    private Integer stockCount;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    public SeckillProduct() {}

    public SeckillProduct(Long productId, BigDecimal seckillPrice, Integer stockCount,
                         LocalDateTime startTime, LocalDateTime endTime) {
        this.productId = productId;
        this.seckillPrice = seckillPrice;
        this.stockCount = stockCount;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = 1;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public BigDecimal getSeckillPrice() {
        return seckillPrice;
    }

    public void setSeckillPrice(BigDecimal seckillPrice) {
        this.seckillPrice = seckillPrice;
    }

    public Integer getStockCount() {
        return stockCount;
    }

    public void setStockCount(Integer stockCount) {
        this.stockCount = stockCount;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "SeckillProduct{" +
                "id=" + id +
                ", productId=" + productId +
                ", seckillPrice=" + seckillPrice +
                ", stockCount=" + stockCount +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", status=" + status +
                ", createTime=" + createTime +
                '}';
    }
}