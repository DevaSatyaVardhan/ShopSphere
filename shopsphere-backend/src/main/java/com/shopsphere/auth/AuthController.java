package com.shopsphere.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopsphere.common.ApiResponse;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @Size(min = 8) String password) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record AuthData(String token, String name, String email, String role) {}
    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) { this.authService = authService; this.jwtService = jwtService; }

    @PostMapping("/register")
    public ApiResponse<AuthData> register(@Valid @RequestBody RegisterRequest request) { var account = authService.register(request.name(), request.email(), request.password()); return ApiResponse.ok(toData(account)); }

    @PostMapping("/login")
    public ApiResponse<AuthData> login(@Valid @RequestBody LoginRequest request) { return ApiResponse.ok(toData(authService.authenticate(request.email(), request.password()))); }

    private AuthData toData(AuthService.Account account) { return new AuthData(jwtService.issue(account), account.name(), account.email(), account.role()); }
}
