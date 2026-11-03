package com.shopsphere.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.product.ProductCatalogService;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    public record OrderItem(Long productId, int quantity) {}
    public record CheckoutRequest(@NotEmpty List<OrderItem> items, @NotEmpty String idempotencyKey, boolean paymentSucceeds) {}
    public record OrderResponse(String orderNumber, String status, String paymentStatus, BigDecimal total, Instant createdAt) {}
    private final Map<String, List<OrderResponse>> orders = new ConcurrentHashMap<>();
    private final ProductCatalogService catalog;
    public OrderController(ProductCatalogService catalog) { this.catalog = catalog; }
    @PostMapping("/checkout") public ApiResponse<OrderResponse> checkout(Authentication auth, @Valid @RequestBody CheckoutRequest request) { if (!request.paymentSucceeds()) return ApiResponse.ok(new OrderResponse("PENDING", "PAYMENT_FAILED", "FAILED", BigDecimal.ZERO, Instant.now())); var total = request.items().stream().map(item -> catalog.findById(item.productId()).price().multiply(BigDecimal.valueOf(item.quantity()))).reduce(BigDecimal.ZERO, BigDecimal::add); var order = new OrderResponse("SS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), "CONFIRMED", "PAID", total, Instant.now()); orders.computeIfAbsent(auth.getName(), ignored -> new java.util.concurrent.CopyOnWriteArrayList<>()).add(order); return ApiResponse.ok(order); }
    @GetMapping public ApiResponse<List<OrderResponse>> findMine(Authentication auth) { return ApiResponse.ok(orders.getOrDefault(auth.getName(), List.of())); }
}
