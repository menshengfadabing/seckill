package com.example.service;

import com.example.entity.User;
import com.example.exception.BusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;

/**
 * 用户服务类
 */
@Service
public class UserService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 用户注册
     */
    @Transactional
    public boolean register(String username, String password) {
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException("用户名不能为空");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException("密码不能为空");
        }

        try {
            // 检查用户名是否已存在
            User existUser = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getResultStream()
                    .findFirst()
                    .orElse(null);

            if (existUser != null) {
                throw new BusinessException("用户名已存在");
            }

            // 密码加密
            String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());

            // 创建用户
            User user = new User(username, encryptedPassword);
            entityManager.persist(user);

            return true;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException("注册失败: " + e.getMessage());
        }
    }

    /**
     * 用户登录
     */
    public User login(String username, String password) {
        try {
            // 密码加密
            String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());

            User user = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username AND u.password = :password", User.class)
                    .setParameter("username", username)
                    .setParameter("password", encryptedPassword)
                    .getResultStream()
                    .findFirst()
                    .orElse(null);

            if (user != null) {
                // 不缓存密码信息
                user.setPassword(null);
            }

            return user;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 根据ID获取用户
     */
    public User getUserById(Long id) {
        String cacheKey = "user:" + id;
        User user = (User) redisTemplate.opsForValue().get(cacheKey);

        if (user == null) {
            User dbUser = entityManager.find(User.class, id);
            if (dbUser != null) {
                // 创建新的User对象，避免修改原始实体
                user = new User();
                user.setId(dbUser.getId());
                user.setUsername(dbUser.getUsername());
                user.setCreateTime(dbUser.getCreateTime());
                // 不设置密码信息

                redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
            }
        }

        return user;
    }

    /**
     * 根据用户名获取用户
     */
    public User getUserByUsername(String username) {
        String cacheKey = "user:username:" + username;
        User user = (User) redisTemplate.opsForValue().get(cacheKey);

        if (user == null) {
            User dbUser = entityManager.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                    .setParameter("username", username)
                    .getResultStream()
                    .findFirst()
                    .orElse(null);

            if (dbUser != null) {
                // 创建新的User对象，避免修改原始实体
                user = new User();
                user.setId(dbUser.getId());
                user.setUsername(dbUser.getUsername());
                user.setCreateTime(dbUser.getCreateTime());
                // 不设置密码信息

                redisTemplate.opsForValue().set(cacheKey, user, 30, TimeUnit.MINUTES);
            }
        }

        return user;
    }
}