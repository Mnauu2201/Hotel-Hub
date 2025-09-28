package com.hotelhub.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public Map<String, String> publicEndpoint() {
        return Map.of("message", "Public endpoint - không cần authentication");
    }

    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint() {
        return Map.of("message", "Protected endpoint - cần authentication");
    }
}