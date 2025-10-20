package com.example.controller;

import com.example.common.Result;
import com.example.entity.Product;
import com.example.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 商品控制器
 */
@RestController
@RequestMapping("/api/products")
@Tag(name = "商品管理", description = "商品相关接口")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "获取所有商品", description = "获取所有状态正常的商品列表")
    public Result<List<Product>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return Result.success("获取商品列表成功", products);
        } catch (Exception e) {
            return Result.error("获取商品列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取商品详情", description = "根据商品ID获取商品的详细信息")
    public Result<Product> getProductById(
            @Parameter(description = "商品ID", required = true)
            @PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product != null) {
                return Result.success("获取商品详情成功", product);
            } else {
                return Result.error("商品不存在");
            }
        } catch (Exception e) {
            return Result.error("获取商品详情失败: " + e.getMessage());
        }
    }

    @PostMapping
    @Operation(summary = "添加商品", description = "添加新的商品")
    public Result<String> addProduct(@RequestBody Product product) {
        try {
            boolean success = productService.addProduct(product);
            if (success) {
                return Result.success("添加商品成功");
            } else {
                return Result.error("添加商品失败");
            }
        } catch (Exception e) {
            return Result.error("添加商品失败: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新商品", description = "更新商品信息")
    public Result<String> updateProduct(
            @Parameter(description = "商品ID", required = true)
            @PathVariable Long id,
            @RequestBody Product product) {
        try {
            product.setId(id);
            boolean success = productService.updateProduct(product);
            if (success) {
                return Result.success("更新商品成功");
            } else {
                return Result.error("更新商品失败");
            }
        } catch (Exception e) {
            return Result.error("更新商品失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除商品", description = "根据ID删除商品")
    public Result<String> deleteProduct(
            @Parameter(description = "商品ID", required = true)
            @PathVariable Long id) {
        try {
            boolean success = productService.deleteProduct(id);
            if (success) {
                return Result.success("删除商品成功");
            } else {
                return Result.error("删除商品失败");
            }
        } catch (Exception e) {
            return Result.error("删除商品失败: " + e.getMessage());
        }
    }
}