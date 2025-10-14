package com.hotelhub.backend.controller;

import com.hotelhub.backend.entity.ActivityLog;
import com.hotelhub.backend.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/activity-logs")
@PreAuthorize("hasRole('ADMIN')")
public class ActivityLogController {
    
    @Autowired
    private ActivityLogService activityLogService;
    
    /**
     * Lấy tất cả logs (Admin only)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getAllLogs(pageable);
        
        // Transform logs to include user information properly
        List<Map<String, Object>> transformedLogs = logs.getContent().stream()
            .map(log -> {
                Map<String, Object> logMap = new HashMap<>();
                logMap.put("logId", log.getLogId());
                logMap.put("userId", log.getUserId());
                logMap.put("action", log.getAction());
                logMap.put("detail", log.getDetail());
                logMap.put("createdAt", log.getCreatedAt());
                
                // Add user information if available
                if (log.getUser() != null) {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("name", log.getUser().getName());
                    userMap.put("email", log.getUser().getEmail());
                    logMap.put("user", userMap);
                } else {
                    logMap.put("user", null);
                }
                
                return logMap;
            })
            .collect(java.util.stream.Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", transformedLogs);
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy logs của user cụ thể
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserLogs(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getUserLogs(userId, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy system logs
     */
    @GetMapping("/system")
    public ResponseEntity<Map<String, Object>> getSystemLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getSystemLogs(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy user activity logs (không phải system)
     */
    @GetMapping("/user-activity")
    public ResponseEntity<Map<String, Object>> getUserActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getUserActivityLogs(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy logs theo action
     */
    @GetMapping("/action/{action}")
    public ResponseEntity<Map<String, Object>> getLogsByAction(
            @PathVariable String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getLogsByAction(action, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy logs theo khoảng thời gian
     */
    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getLogsByDateRange(startDate, endDate, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy logs của user theo khoảng thời gian
     */
    @GetMapping("/user/{userId}/date-range")
    public ResponseEntity<Map<String, Object>> getUserLogsByDateRange(
            @PathVariable Integer userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ActivityLog> logs = activityLogService.getUserLogsByDateRange(userId, startDate, endDate, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("hasNext", logs.hasNext());
        response.put("hasPrevious", logs.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Đếm logs theo action
     */
    @GetMapping("/count/action/{action}")
    public ResponseEntity<Map<String, Object>> countLogsByAction(@PathVariable String action) {
        Long count = activityLogService.countLogsByAction(action);
        
        Map<String, Object> response = new HashMap<>();
        response.put("action", action);
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy logs gần đây nhất
     */
    @GetMapping("/recent")
    public ResponseEntity<Map<String, Object>> getRecentLogs(@RequestParam(defaultValue = "10") int limit) {
        List<ActivityLog> logs = activityLogService.getRecentLogs(limit);
        
        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs);
        response.put("count", logs.size());
        
        return ResponseEntity.ok(response);
    }
}


