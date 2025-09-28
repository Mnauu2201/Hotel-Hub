package com.hotelhub.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashPasswordTest {

    @Test
    public void hashTestPassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Hash password "test123"
        String testPassword = encoder.encode("test123");
        System.out.println("=== PASSWORD HASH ===");
        System.out.println("Password 'test123' hashed: " + testPassword);
        System.out.println("===================");
        
        // Test verify
        boolean matches = encoder.matches("test123", testPassword);
        System.out.println("Password matches: " + matches);
    }
}
