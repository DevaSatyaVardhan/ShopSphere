package com.shopsphere.cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.product.ProductCatalogService;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    public record CartItem(Long productId, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
    public record CartResponse(java.util.List<CartItem> items, BigDecimal subtotal) {}
    public record ItemRequest(@NotNull Long productId, @Min(1) int quantity) {}
    private final Map<String, Map<Long, Integer>> carts = new ConcurrentHashMap<>();
    private final ProductCatalogService catalog;
    public CartController(ProductCatalogService catalog) { this.catalog = catalog; }
    @GetMapping public ApiResponse<CartResponse> get(Authentication auth) { return ApiResponse.ok(toResponse(auth.getName())); }
    @PostMapping("/items") public ApiResponse<CartResponse> add(Authentication auth, @Valid @RequestBody ItemRequest request) { carts.computeIfAbsent(auth.getName(), ignored -> new ConcurrentHashMap<>()).merge(request.productId(), request.quantity(), Integer::sum); return ApiResponse.ok(toResponse(auth.getName())); }
    @PutMapping("/items/{productId}") public ApiResponse<CartResponse> update(Authentication auth, @PathVariable Long productId, @Valid @RequestBody ItemRequest request) { carts.computeIfAbsent(auth.getName(), ignored -> new ConcurrentHashMap<>()).put(productId, request.quantity()); return ApiResponse.ok(toResponse(auth.getName())); }
    @DeleteMapping("/items/{productId}") public ApiResponse<CartResponse> remove(Authentication auth, @PathVariable Long productId) { var cart = carts.computeIfAbsent(auth.getName(), ignored -> new ConcurrentHashMap<>()); cart.remove(productId); return ApiResponse.ok(toResponse(auth.getName())); }
    private CartResponse toResponse(String email) { var items = new ArrayList<CartItem>(); var subtotal = BigDecimal.ZERO; for (var entry : carts.getOrDefault(email, Map.of()).entrySet()) { var product = catalog.findById(entry.getKey()); var lineTotal = product.price().multiply(BigDecimal.valueOf(entry.getValue())); items.add(new CartItem(product.id(), entry.getValue(), product.price(), lineTotal)); subtotal = subtotal.add(lineTotal); } return new CartResponse(items, subtotal); }
}
