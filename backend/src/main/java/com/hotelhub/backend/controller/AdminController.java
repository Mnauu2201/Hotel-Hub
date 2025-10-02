package com.hotelhub.backend.controller;

import com.hotelhub.backend.service.ScheduledService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ScheduledService scheduledService;

    /**
     * API để test manual cancel expired bookings
     */
    @PostMapping("/cancel-expired-bookings")
    public ResponseEntity<?> cancelExpiredBookings() {
        try {
            scheduledService.cancelExpiredBookings();
            return ResponseEntity.ok(Map.of(
                    "message", "Đã chạy scheduled job để hủy booking hết hạn"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi khi chạy scheduled job",
                    "message", e.getMessage()
            ));
        }
    }
    
    /**
     * API để test scheduled job (không cần ROLE_ADMIN)
     */
    @GetMapping("/test-scheduled")
    public ResponseEntity<?> testScheduled() {
        try {
            scheduledService.cancelExpiredBookings();
            return ResponseEntity.ok(Map.of(
                    "message", "Test scheduled job thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi khi test scheduled job",
                    "message", e.getMessage()
            ));
        }
    }
}

