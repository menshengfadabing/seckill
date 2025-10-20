package com.example.service;

import com.example.entity.SeckillOrder;
import com.example.entity.SeckillProduct;
import com.example.entity.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.redis.core.RedisTemplate;
import jakarta.inject.Inject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * 秒杀服务类
 */
@Service
public class SeckillService {

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取所有秒杀商品
     */
    public List<SeckillProduct> getAllSeckillProducts() {
        String cacheKey = "seckill:products:all";
        List<SeckillProduct> products = (List<SeckillProduct>) redisTemplate.opsForValue().get(cacheKey);

        if (products == null) {
            LocalDateTime now = LocalDateTime.now();
            products = entityManager.createQuery(
                "SELECT sp FROM SeckillProduct sp WHERE sp.status = 1 AND sp.endTime >= :now",
                SeckillProduct.class)
                .setParameter("now", now)
                .getResultList();
            redisTemplate.opsForValue().set(cacheKey, products, 5, TimeUnit.MINUTES);
        }

        return products;
    }

    /**
     * 根据ID获取秒杀商品
     */
    public SeckillProduct getSeckillProductById(Long id) {
        String cacheKey = "seckill:product:" + id;
        SeckillProduct product = (SeckillProduct) redisTemplate.opsForValue().get(cacheKey);

        if (product == null) {
            product = entityManager.find(SeckillProduct.class, id);
            if (product != null) {
                redisTemplate.opsForValue().set(cacheKey, product, 30, TimeUnit.MINUTES);
            }
        }

        return product;
    }

    /**
     * 预热秒杀库存到Redis
     */
    public void preloadSeckillStock(Long seckillId) {
        SeckillProduct seckillProduct = entityManager.find(SeckillProduct.class, seckillId);
        if (seckillProduct != null && seckillProduct.getStatus() == 1) {
            String stockKey = "seckill:stock:" + seckillId;
            redisTemplate.opsForValue().set(stockKey, seckillProduct.getStockCount());

            // 设置过期时间为活动结束时间
            long ttl = java.time.Duration.between(LocalDateTime.now(), seckillProduct.getEndTime()).getSeconds();
            if (ttl > 0) {
                redisTemplate.expire(stockKey, ttl, TimeUnit.SECONDS);
            }
        }
    }

    /**
     * 执行秒杀
     */
    @Transactional
    public boolean doSeckill(Long userId, Long seckillId) {
        // 1. 检查用户是否已经购买过
        String userKey = "user:" + userId + ":seckill:" + seckillId;
        if (redisTemplate.hasKey(userKey)) {
            return false; // 已经购买过
        }

        // 2. 检查秒杀活动是否存在且有效
        SeckillProduct seckillProduct = getSeckillProductById(seckillId);
        if (seckillProduct == null || seckillProduct.getStatus() != 1) {
            return false; // 活动不存在或已结束
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(seckillProduct.getStartTime()) || now.isAfter(seckillProduct.getEndTime())) {
            return false; // 活动未开始或已结束
        }

        // 3. 原子扣减Redis库存
        String stockKey = "seckill:stock:" + seckillId;
        Long stock = redisTemplate.opsForValue().decrement(stockKey);

        if (stock < 0) {
            // 库存不足，回滚
            redisTemplate.opsForValue().increment(stockKey);
            return false;
        }

        // 4. 创建订单
        String orderNo = UUID.randomUUID().toString();
        SeckillOrder order = new SeckillOrder();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setProductId(seckillProduct.getProductId());
        order.setSeckillId(seckillId);
        order.setSeckillPrice(seckillProduct.getSeckillPrice());
        order.setCreateTime(now);

        try {
            entityManager.persist(order);
            if (order.getId() != null) {
                // 5. 标记用户已购买
                redisTemplate.opsForValue().set(userKey, "1");

                // 设置过期时间为活动结束时间
                long ttl = java.time.Duration.between(now, seckillProduct.getEndTime()).getSeconds();
                if (ttl > 0) {
                    redisTemplate.expire(userKey, ttl, TimeUnit.SECONDS);
                }

                return true;
            } else {
                // 订单创建失败，回滚库存
                redisTemplate.opsForValue().increment(stockKey);
                return false;
            }
        } catch (Exception e) {
            // 异常情况，回滚库存
            redisTemplate.opsForValue().increment(stockKey);
            throw e;
        }
    }

    /**
     * 添加秒杀商品
     */
    @Transactional
    public boolean addSeckillProduct(SeckillProduct seckillProduct) {
        try {
            entityManager.persist(seckillProduct);
            if (seckillProduct.getId() != null) {
                // 清除缓存并预热库存
                redisTemplate.delete("seckill:products:all");
                preloadSeckillStock(seckillProduct.getId());
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查用户是否已购买该秒杀商品
     */
    public boolean hasUserPurchased(Long userId, Long seckillId) {
        String userKey = "user:" + userId + ":seckill:" + seckillId;
        return redisTemplate.hasKey(userKey);
    }
}