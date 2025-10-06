package com.hotelhub.backend.controller;

import com.hotelhub.backend.service.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-simple")
    public ResponseEntity<String> sendSimpleEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text) {
        try {
            emailService.sendSimpleEmail(to, subject, text);
            return ResponseEntity.ok("Email đã được gửi thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi gửi email: " + e.getMessage());
        }
    }

    @PostMapping("/send-html")
    public ResponseEntity<String> sendHtmlEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String htmlContent) {
        try {
            emailService.sendHtmlEmail(to, subject, htmlContent);
            return ResponseEntity.ok("Email HTML đã được gửi thành công!");
        } catch (MessagingException e) {
            return ResponseEntity.badRequest().body("Lỗi khi gửi email: " + e.getMessage());
        }
    }
}
