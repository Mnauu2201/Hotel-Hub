package com.hotelhub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test/public")
    public String publicApi() {
        return "✅ Public API - ai cũng gọi được!";
    }

    @GetMapping("/api/test/private")
    public String privateApi() {
        return "🔒 Private API - bạn đã login thành công!";
    }
}
