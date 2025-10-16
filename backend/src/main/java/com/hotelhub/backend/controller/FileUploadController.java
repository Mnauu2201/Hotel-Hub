package com.hotelhub.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/images/";

    @GetMapping("/test")
    public ResponseEntity<?> testUpload() {
        return ResponseEntity.ok(Map.of("message", "Upload API is working"));
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            // Tạo thư mục upload nếu chưa có
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // Lưu file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Tạo URL
            String imageUrl = "/uploads/images/" + filename;

            return ResponseEntity.ok(Map.of(
                "message", "Upload thành công",
                "imageUrl", imageUrl,
                "filename", filename
            ));

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Upload thất bại",
                "message", e.getMessage()
            ));
        }
    }
}
