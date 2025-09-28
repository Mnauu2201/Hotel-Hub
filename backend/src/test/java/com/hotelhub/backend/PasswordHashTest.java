package com.hotelhub.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashTest {

    @Test
    public void hashPasswords() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Hash password "test123"
        String testPassword = encoder.encode("test123");
        System.out.println("Password 'test123' hashed: " + testPassword);
        
        // Hash password "admin123"  
        String adminPassword = encoder.encode("admin123");
        System.out.println("Password 'admin123' hashed: " + adminPassword);
        
        // Hash password "password123"
        String userPassword = encoder.encode("password123");
        System.out.println("Password 'password123' hashed: " + userPassword);
    }
}
