package com.example.controller;

import com.example.common.Result;
import com.example.dto.SeckillRequest;
import com.example.entity.SeckillProduct;
import com.example.entity.SeckillOrder;
import com.example.service.SeckillService;
import com.example.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 秒杀控制器
 */
@RestController
@RequestMapping("/api/seckill")
@Tag(name = "秒杀管理", description = "秒杀相关接口")
public class SeckillController {

    @Autowired
    private SeckillService seckillService;

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    @Operation(summary = "获取秒杀商品列表", description = "获取所有正在进行或即将开始的秒杀商品")
    public Result<List<SeckillProduct>> getSeckillProductList() {
        try {
            List<SeckillProduct> products = seckillService.getAllSeckillProducts();
            return Result.success("获取秒杀商品列表成功", products);
        } catch (Exception e) {
            return Result.error("获取秒杀商品列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/product/{id}")
    @Operation(summary = "获取秒杀商品详情", description = "根据秒杀商品ID获取详细信息")
    public Result<SeckillProduct> getSeckillProductDetail(
            @Parameter(description = "秒杀商品ID", required = true)
            @PathVariable("id") Long id) {
        try {
            SeckillProduct product = seckillService.getSeckillProductById(id);
            if (product != null) {
                return Result.success("获取秒杀商品详情成功", product);
            } else {
                return Result.error("秒杀商品不存在");
            }
        } catch (Exception e) {
            return Result.error("获取秒杀商品详情失败: " + e.getMessage());
        }
    }

    @PostMapping("/do")
    @Operation(summary = "执行秒杀", description = "用户执行秒杀操作")
    public Result<Map<String, Object>> doSeckill(
            @Parameter(description = "秒杀请求参数", required = true)
            @Valid @RequestBody SeckillRequest request) {
        try {
            Long userId = request.getUserId();
            Long seckillId = request.getSeckillId();

            if (userId == null || seckillId == null) {
                return Result.error("用户ID和秒杀商品ID不能为空");
            }

            // 检查用户是否存在
            if (userService.getUserById(userId) == null) {
                return Result.error("用户不存在");
            }

            // 检查是否已经购买过
            if (seckillService.hasUserPurchased(userId, seckillId)) {
                return Result.error("您已经购买过该商品，不能重复购买");
            }

            // 执行秒杀
            boolean success = seckillService.doSeckill(userId, seckillId);

            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("seckillId", seckillId);

            if (success) {
                result.put("message", "秒杀成功");
                return Result.success("秒杀成功", result);
            } else {
                result.put("message", "秒杀失败");
                return Result.error("秒杀失败，可能是库存不足或活动已结束");
            }
        } catch (Exception e) {
            return Result.error("秒杀失败: " + e.getMessage());
        }
    }

    @PostMapping("/add")
    @Operation(summary = "添加秒杀商品", description = "添加新的秒杀商品")
    public Result<String> addSeckillProduct(@RequestBody SeckillProduct seckillProduct) {
        try {
            boolean success = seckillService.addSeckillProduct(seckillProduct);
            if (success) {
                return Result.success("添加秒杀商品成功");
            } else {
                return Result.error("添加秒杀商品失败");
            }
        } catch (Exception e) {
            return Result.error("添加秒杀商品失败: " + e.getMessage());
        }
    }

    @PostMapping("/preload/{id}")
    @Operation(summary = "预热秒杀库存", description = "将秒杀商品库存预热到Redis")
    public Result<String> preloadSeckillStock(
            @Parameter(description = "秒杀商品ID", required = true)
            @PathVariable("id") Long id) {
        try {
            seckillService.preloadSeckillStock(id);
            return Result.success("库存预热成功");
        } catch (Exception e) {
            return Result.error("库存预热失败: " + e.getMessage());
        }
    }

    @GetMapping("/check/{userId}/{seckillId}")
    @Operation(summary = "检查用户是否已购买", description = "检查用户是否已经购买过指定的秒杀商品")
    public Result<Map<String, Object>> checkUserPurchase(
            @Parameter(description = "用户ID", required = true)
            @PathVariable("userId") Long userId,
            @Parameter(description = "秒杀商品ID", required = true)
            @PathVariable("seckillId") Long seckillId) {
        try {
            boolean hasPurchased = seckillService.hasUserPurchased(userId, seckillId);

            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId);
            result.put("seckillId", seckillId);
            result.put("hasPurchased", hasPurchased);

            return Result.success("查询成功", result);
        } catch (Exception e) {
            return Result.error("查询失败: " + e.getMessage());
        }
    }

    @GetMapping("/orders/{userId}")
    @Operation(summary = "获取用户秒杀订单列表", description = "获取指定用户的所有秒杀订单")
    public Result<List<SeckillOrder>> getUserOrders(
            @Parameter(description = "用户ID", required = true)
            @PathVariable("userId") Long userId) {
        try {
            List<SeckillOrder> orders = seckillService.getUserOrders(userId);
            return Result.success("获取用户订单列表成功", orders);
        } catch (Exception e) {
            return Result.error("获取用户订单列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/order/{orderNo}")
    @Operation(summary = "根据订单号获取订单详情", description = "根据订单号获取订单详细信息")
    public Result<SeckillOrder> getOrderByNo(
            @Parameter(description = "订单号", required = true)
            @PathVariable("orderNo") String orderNo) {
        try {
            SeckillOrder order = seckillService.getOrderByNo(orderNo);
            if (order != null) {
                return Result.success("获取订单详情成功", order);
            } else {
                return Result.error("订单不存在");
            }
        } catch (Exception e) {
            return Result.error("获取订单详情失败: " + e.getMessage());
        }
    }
}