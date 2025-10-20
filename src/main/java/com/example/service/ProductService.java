package com.example.service;

import com.example.entity.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.redis.core.RedisTemplate;
import jakarta.inject.Inject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 商品服务类
 */
@Service
public class ProductService {

    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 获取所有商品
     */
    public List<Product> getAllProducts() {
        String cacheKey = "products:all";
        List<Product> products = (List<Product>) redisTemplate.opsForValue().get(cacheKey);

        if (products == null) {
            products = entityManager.createQuery("SELECT p FROM Product p WHERE p.status = 1", Product.class).getResultList();
            redisTemplate.opsForValue().set(cacheKey, products, 30, TimeUnit.MINUTES);
        }

        return products;
    }

    /**
     * 根据ID获取商品
     */
    public Product getProductById(Long id) {
        String cacheKey = "product:" + id;
        Product product = (Product) redisTemplate.opsForValue().get(cacheKey);

        if (product == null) {
            product = entityManager.find(Product.class, id);
            if (product != null) {
                redisTemplate.opsForValue().set(cacheKey, product, 30, TimeUnit.MINUTES);
            }
        }

        return product;
    }

    /**
     * 添加商品
     */
    @Transactional
    public boolean addProduct(Product product) {
        try {
            entityManager.persist(product);
            // 清除缓存
            redisTemplate.delete("products:all");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 更新商品
     */
    @Transactional
    public boolean updateProduct(Product product) {
        try {
            entityManager.merge(product);
            // 清除相关缓存
            redisTemplate.delete("product:" + product.getId());
            redisTemplate.delete("products:all");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 删除商品
     */
    @Transactional
    public boolean deleteProduct(Long id) {
        try {
            Product product = entityManager.find(Product.class, id);
            if (product != null) {
                entityManager.remove(product);
                // 清除相关缓存
                redisTemplate.delete("product:" + id);
                redisTemplate.delete("products:all");
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}