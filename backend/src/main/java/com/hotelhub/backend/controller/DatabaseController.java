package com.hotelhub.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/database")
public class DatabaseController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Update description column to TEXT (No auth required for debugging)
     */
    @PostMapping("/update-description-column")
    public ResponseEntity<?> updateDescriptionColumn() {
        try {
            // Update description column to TEXT
            jdbcTemplate.execute("ALTER TABLE rooms MODIFY COLUMN description TEXT");
            
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật cột description thành công",
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Lỗi cập nhật database: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Check current column definition
     */
    @GetMapping("/check-description-column")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> checkDescriptionColumn() {
        try {
            // Get column information
            var result = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH " +
                "FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rooms' AND COLUMN_NAME = 'description'"
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Thông tin cột description",
                "column_info", result,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Lỗi kiểm tra database: " + e.getMessage(),
                "status", "error"
            ));
        }
    }
}
