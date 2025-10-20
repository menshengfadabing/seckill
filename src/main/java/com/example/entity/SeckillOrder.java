package com.example.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 秒杀订单实体类
 */
@Entity
@Table(name = "seckill_orders")
public class SeckillOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNo;

    private Long userId;

    private Long productId;

    private Long seckillId;

    private BigDecimal seckillPrice;

    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime payTime;

    public SeckillOrder() {}

    public SeckillOrder(String orderNo, Long userId, Long productId, BigDecimal seckillPrice) {
        this.orderNo = orderNo;
        this.userId = userId;
        this.productId = productId;
        this.seckillPrice = seckillPrice;
        this.status = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getSeckillId() {
        return seckillId;
    }

    public void setSeckillId(Long seckillId) {
        this.seckillId = seckillId;
    }

    public BigDecimal getSeckillPrice() {
        return seckillPrice;
    }

    public void setSeckillPrice(BigDecimal seckillPrice) {
        this.seckillPrice = seckillPrice;
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

    public LocalDateTime getPayTime() {
        return payTime;
    }

    public void setPayTime(LocalDateTime payTime) {
        this.payTime = payTime;
    }

    @Override
    public String toString() {
        return "SeckillOrder{" +
                "id=" + id +
                ", orderNo='" + orderNo + '\'' +
                ", userId=" + userId +
                ", productId=" + productId +
                ", seckillPrice=" + seckillPrice +
                ", status=" + status +
                ", createTime=" + createTime +
                '}';
    }
}