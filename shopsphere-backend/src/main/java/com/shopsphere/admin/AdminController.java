package com.shopsphere.admin;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.common.ApiResponse;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard() { return ApiResponse.ok(Map.of("revenue", 12840, "orders", 184, "products", 48, "customers", 1208, "lowStock", 7)); }
}
