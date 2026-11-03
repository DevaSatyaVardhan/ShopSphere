package com.shopsphere.auth;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public record Account(String name, String email, String passwordHash, String role) {}
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder;

    public AuthService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        accounts.put("admin@shopsphere.com", new Account("Admin User", "admin@shopsphere.com", passwordEncoder.encode("admin123"), "ADMIN"));
    }

    public Account register(String name, String email, String password) {
        String normalized = email.toLowerCase();
        if (accounts.containsKey(normalized)) throw new IllegalArgumentException("Email is already registered");
        Account account = new Account(name, normalized, passwordEncoder.encode(password), "CUSTOMER");
        accounts.put(normalized, account);
        return account;
    }

    public Account authenticate(String email, String password) {
        Account account = accounts.get(email.toLowerCase());
        if (account == null || !passwordEncoder.matches(password, account.passwordHash())) throw new IllegalArgumentException("Invalid email or password");
        return account;
    }
}
