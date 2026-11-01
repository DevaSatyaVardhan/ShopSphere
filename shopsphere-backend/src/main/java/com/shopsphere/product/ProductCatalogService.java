package com.shopsphere.product;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProductCatalogService {
    public record ProductResponse(Long id, String name, String category, BigDecimal price, BigDecimal oldPrice, String image, int stock, String description) {}
    private final List<ProductResponse> products = List.of(
        new ProductResponse(1L, "Cloudline Overshirt", "Apparel", new BigDecimal("84.00"), new BigDecimal("112.00"), "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85", 18, "A relaxed, everyday layer in brushed organic cotton."),
        new ProductResponse(2L, "Arc Table Lamp", "Home", new BigDecimal("128.00"), null, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", 7, "Warm, sculptural lighting with a brushed metal finish."),
        new ProductResponse(3L, "Field Notes Set", "Wellness", new BigDecimal("24.00"), null, "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85", 42, "Three linen-bound notebooks for ideas and lists."),
        new ProductResponse(4L, "Studio Headphones", "Tech", new BigDecimal("196.00"), new BigDecimal("240.00"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", 11, "Balanced wireless sound for long sessions.")
    );
    public List<ProductResponse> findAll(String search, String category) { return products.stream().filter(product -> search == null || product.name().toLowerCase().contains(search.toLowerCase())).filter(product -> category == null || category.equalsIgnoreCase(product.category())).toList(); }
    public ProductResponse findById(Long id) { return products.stream().filter(product -> product.id().equals(id)).findFirst().orElseThrow(() -> new IllegalArgumentException("Product not found")); }
}
