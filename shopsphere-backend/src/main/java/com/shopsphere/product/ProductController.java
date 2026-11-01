package com.shopsphere.product;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.product.ProductCatalogService.ProductResponse;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductCatalogService catalog;
    public ProductController(ProductCatalogService catalog) { this.catalog = catalog; }
    @GetMapping public ApiResponse<List<ProductResponse>> findAll(@RequestParam(required = false) String search, @RequestParam(required = false) String category) { return ApiResponse.ok(catalog.findAll(search, category)); }
    @GetMapping("/{id}") public ApiResponse<ProductResponse> findById(@PathVariable Long id) { return ApiResponse.ok(catalog.findById(id)); }
}
