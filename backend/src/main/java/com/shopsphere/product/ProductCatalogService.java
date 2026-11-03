package com.shopsphere.product;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProductCatalogService {
    public record ProductResponse(Long id, String name, String category, BigDecimal price, BigDecimal oldPrice, String image, int stock, String description) {}
    private final List<ProductResponse> products = List.of(
        new ProductResponse(1L, "Cloudline Overshirt", "Apparel", new BigDecimal("84.00"), new BigDecimal("112.00"), "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85", 18, "A relaxed, everyday layer in brushed organic cotton with a softly structured silhouette."),
        new ProductResponse(2L, "Arc Table Lamp", "Home", new BigDecimal("128.00"), null, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", 7, "Warm, sculptural lighting with a brushed solid brass finish and a quiet footprint."),
        new ProductResponse(3L, "Field Notes Set", "Wellness", new BigDecimal("24.00"), null, "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85", 42, "Three linen-bound notebooks for ideas, daily logs, and details worth keeping."),
        new ProductResponse(4L, "Studio Wireless Headphones", "Tech", new BigDecimal("196.00"), new BigDecimal("240.00"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", 11, "Balanced acoustic tuning, soft vegan leather memory foam, and up to 40 hours battery life."),
        new ProductResponse(5L, "Matte Ceramic Pour-Over", "Home", new BigDecimal("46.00"), null, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85", 15, "A tactile, minimalist coffee dripper designed for precision extraction."),
        new ProductResponse(6L, "Heavyweight Merino Tee", "Apparel", new BigDecimal("68.00"), null, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85", 22, "100% ultrafine Australian merino wool. Naturally odor-resistant and thermo-regulating."),
        new ProductResponse(7L, "Minimalist Walnut Desk Mat", "Tech", new BigDecimal("52.00"), null, "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=85", 14, "Elevate your workspace with rich full-grain vegetable tanned leather backed with wool felt."),
        new ProductResponse(8L, "Botanical Amber Scented Candle", "Wellness", new BigDecimal("36.00"), null, "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85", 30, "Hand-poured coconut-soy wax infused with notes of smoked cedar, amber, and cypress."),
        new ProductResponse(9L, "Cast Iron Kettle & Teapot", "Home", new BigDecimal("78.00"), null, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85", 9, "Traditional Tetsubin style heavy cast-iron teapot with enameled interior."),
        new ProductResponse(10L, "Canvas Chore Jacket", "Apparel", new BigDecimal("138.00"), new BigDecimal("165.00"), "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85", 6, "A utilitarian workwear staple constructed from rugged 12oz duck canvas."),
        new ProductResponse(11L, "Solid Wood Mechanical Keyboard", "Tech", new BigDecimal("145.00"), null, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85", 12, "CNC-milled solid walnut chassis paired with hot-swappable tactile switches."),
        new ProductResponse(12L, "Organic Stonewashed Linen Throw", "Wellness", new BigDecimal("92.00"), new BigDecimal("115.00"), "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85", 19, "Pre-washed French flax linen throw with fringed edges. Incredibly soft and airy.")
    );

    public List<ProductResponse> findAll(String search, String category) {
        return products.stream()
            .filter(product -> search == null || product.name().toLowerCase().contains(search.toLowerCase()))
            .filter(product -> category == null || category.equalsIgnoreCase(product.category()))
            .toList();
    }

    public ProductResponse findById(Long id) {
        return products.stream()
            .filter(product -> product.id().equals(id))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }
}
