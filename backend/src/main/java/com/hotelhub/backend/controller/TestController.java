package com.hotelhub.backend.controller;

import com.hotelhub.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/public")
    public Map<String, String> publicEndpoint() {
        return Map.of("message", "Public endpoint - không cần authentication");
    }

    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint() {
        return Map.of("message", "Protected endpoint - cần authentication");
    }

    @GetMapping("/debug-price/{roomId}")
    public ResponseEntity<?> debugPrice(@PathVariable Long roomId) {
        try {
            // Lấy thông tin phòng
            var room = roomRepository.findById(roomId);
            if (room.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Phòng không tồn tại"
                ));
            }

            var r = room.get();
            
            // Test tính giá
            LocalDate checkIn = LocalDate.of(2025, 10, 10);
            LocalDate checkOut = LocalDate.of(2025, 12, 10);
            long nights = checkIn.until(checkOut).getDays();
            BigDecimal totalPrice = BigDecimal.valueOf(r.getPrice()).multiply(BigDecimal.valueOf(nights));

            return ResponseEntity.ok(Map.of(
                    "roomId", r.getRoomId(),
                    "roomNumber", r.getRoomNumber(),
                    "price", r.getPrice(),
                    "checkIn", checkIn.toString(),
                    "checkOut", checkOut.toString(),
                    "nights", nights,
                    "calculatedPrice", totalPrice.toString(),
                    "status", r.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Lỗi debug: " + e.getMessage()
            ));
        }
    }
}